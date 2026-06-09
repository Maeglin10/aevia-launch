"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Heart,
  Award,
  Users,
  Leaf,
  CheckCircle,
  ShoppingBag,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { TemplateIcon } from "@/components/TemplateIcon";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
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

const FONT_HEADING = "'Playfair Display', Georgia, serif";
const FONT_BODY = "'Source Sans Pro', system-ui, sans-serif";

// ─── Page Type ─────────────────────────────────────────────────────────────────
type BoulPage = "home" | "boutique" | "tartes" | "reservation" | "atelier" | "contact" | "mentions" | "privacy";

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
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

// ─── Boutique Page ────────────────────────────────────────────────────────────
function BoutiquePage({ goTo }: { goTo: (p: BoulPage) => void }) {
  const categories = [
    {
      title: "Pains artisanaux",
      emoji: "🍞",
      items: [
        {
          name: "Pain au levain",
          price: "6,50 €",
          desc: "Levain naturel 20 ans, croûte dorée, mie alvéolée. La signature de La Fournée.",
          img: "photo-1509440159596-0249088772ff",
        },
        {
          name: "Pain complet T80",
          price: "5,20 €",
          desc: "Farine complète Label Rouge, riche en fibres, saveur de noisette.",
          img: "photo-1565299585323-38d6b0865b47",
        },
        {
          name: "Pain de seigle",
          price: "5,80 €",
          desc: "30 % de seigle, mie dense et aromatique, idéal avec du fromage.",
          img: "photo-1598373182133-52452f7691ef",
        },
        {
          name: "Pain à l'épeautre",
          price: "6,20 €",
          desc: "Épeautre ancien non hybridé, goût délicat, digestibilité améliorée.",
          img: "photo-1555507036-ab1f4038808a",
        },
      ],
    },
    {
      title: "Viennoiseries",
      emoji: "🥐",
      items: [
        {
          name: "Croissant pur beurre",
          price: "1,80 €",
          desc: "Feuilletage 27 couches, beurre AOP Poitou-Charentes, doré au four chaque matin.",
          img: "photo-1555507036-ab1f4038808a",
        },
        {
          name: "Pain au chocolat",
          price: "2,10 €",
          desc: "Deux barres Valrhona 70 %, pâte feuilletée maison, fondant garanti.",
          img: "photo-1604882737254-ed4abb408b44",
        },
        {
          name: "Kouign-amann",
          price: "3,20 €",
          desc: "Spécialité bretonne, caramélisé minute, croustillant en surface.",
          img: "photo-1509440159596-0249088772ff",
        },
        {
          name: "Brioche tressée",
          price: "5,90 €",
          desc: "Pur beurre, sucre perlé, vanille Bourbon de Madagascar.",
          img: "photo-1606890658317-7d14490b76fd",
        },
      ],
    },
    {
      title: "Gâteaux de saison",
      emoji: "🎂",
      items: [
        {
          name: "Tarte Tatin",
          price: "4,80 €",
          desc: "Pommes caramélisées, pâte feuilletée inversée, crème fraîche artisanale.",
          img: "photo-1568051243851-f9b136146e97",
        },
        {
          name: "Mille-feuille vanille",
          price: "4,20 €",
          desc: "Feuilletage caramélisé 3 couches, crème diplomate vanille Bourbon.",
          img: "photo-1587248720327-8eb72564be1e",
        },
        {
          name: "Financier aux amandes",
          price: "2,50 €",
          desc: "Beurre noisette, amandes en poudre, texture moelleuse intense.",
          img: "photo-1571115177098-24ec42ed204d",
        },
        {
          name: "Opéra maison",
          price: "5,00 €",
          desc: "Biscuit joconde, ganache café, praliné, glacé au chocolat noir.",
          img: "photo-1578985545062-69928b1d9587",
        },
      ],
    },
  ];

  return (
    <section style={{ padding: "100px 80px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          La Boutique
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 16 }}>
          Notre catalogue artisanal
        </h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Tout est préparé chaque jour dès 4h du matin. Farines Label Rouge, beurre AOP, levain vivant — l'authenticité dans chaque bouchée.
        </p>
      </motion.div>

      {categories.map((cat, ci) => (
        <div key={cat.title} style={{ marginBottom: 72 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ci * 0.1 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}
          >
            <TemplateIcon emoji={cat.emoji} size={32} />
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: C.text }}>{cat.title}</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 22 }}>
            {cat.items.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.1 + i * 0.07 }}
                whileHover={{ y: -6, boxShadow: C.shadowLg }}
                style={{ background: C.white, borderRadius: 18, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
              >
                <img
                  src={`https://images.unsplash.com/${item.img}?w=800&q=80&fit=crop`}
                  alt={item.name}
                  loading="lazy"
                  style={{ width: "100%", height: 180, objectFit: "cover" }}
                />
                <div style={{ padding: "20px 22px" }}>
                  <h3 style={{ fontFamily: FONT_HEADING, fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>{item.name}</h3>
                  <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6, marginBottom: 14 }}>{item.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: C.accent, fontSize: 18 }}>{item.price}</span>
                    <motion.button
                      type="button"
                      onClick={() => goTo("reservation")}
                      style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FONT_BODY }}
                      whileHover={{ background: C.accentDark, scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Commander
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ textAlign: "center", marginTop: 20 }}>
        <motion.button
          type="button"
          onClick={() => goTo("reservation")}
          style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px 40px", fontWeight: 700, fontSize: 17, cursor: "pointer", fontFamily: FONT_BODY }}
          whileHover={{ background: C.accentDark, scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <ShoppingBag size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
          Passer une commande
        </motion.button>
      </motion.div>
    </section>
  );
}

// ─── Tartes Page ──────────────────────────────────────────────────────────────
function TartesPage({ goTo }: { goTo: (p: BoulPage) => void }) {
  const tartes = [
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

  return (
    <section style={{ padding: "100px 80px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 70 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Nos Tartes
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 16 }}>
          Tartes d'exception
        </h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
          Nos tartes signature sont le fruit de recettes transmises, perfectionnées et réinterprétées avec les meilleurs ingrédients du moment.
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: 64, maxWidth: 1000, margin: "0 auto" }}>
        {tartes.map((tarte, i) => (
          <motion.div
            key={tarte.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            style={{
              display: "grid",
              gridTemplateColumns: i % 2 === 0 ? "1fr 1.1fr" : "1.1fr 1fr",
              gap: 48,
              alignItems: "center",
              background: C.white,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: C.shadow,
              border: `1px solid ${C.border}`,
            }}
          >
            {i % 2 === 0 ? (
              <>
                <img
                  src={`https://images.unsplash.com/${tarte.img}?w=800&q=80&fit=crop`}
                  alt={tarte.name}
                  loading="lazy"
                  style={{ width: "100%", height: 340, objectFit: "cover" }}
                />
                <div style={{ padding: "36px 40px 36px 0" }}>
                  <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>{tarte.badge}</div>
                  <h2 style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 6 }}>{tarte.name}</h2>
                  <div style={{ fontSize: 14, color: C.textMuted, fontStyle: "italic", marginBottom: 18 }}>{tarte.subtitle}</div>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, marginBottom: 22 }}>{tarte.desc}</p>
                  <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: C.accent, fontSize: 16, marginBottom: 20 }}>{tarte.price}</div>
                  <motion.button
                    type="button"
                    onClick={() => goTo("reservation")}
                    style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "11px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT_BODY }}
                    whileHover={{ background: C.accentDark, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Réserver cette tarte
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <div style={{ padding: "36px 0 36px 40px" }}>
                  <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>{tarte.badge}</div>
                  <h2 style={{ fontFamily: FONT_HEADING, fontSize: 28, fontWeight: 700, color: C.text, marginBottom: 6 }}>{tarte.name}</h2>
                  <div style={{ fontSize: 14, color: C.textMuted, fontStyle: "italic", marginBottom: 18 }}>{tarte.subtitle}</div>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, marginBottom: 22 }}>{tarte.desc}</p>
                  <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: C.accent, fontSize: 16, marginBottom: 20 }}>{tarte.price}</div>
                  <motion.button
                    type="button"
                    onClick={() => goTo("reservation")}
                    style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "11px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT_BODY }}
                    whileHover={{ background: C.accentDark, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Réserver cette tarte
                  </motion.button>
                </div>
                <img
                  src={`https://images.unsplash.com/${tarte.img}?w=800&q=80&fit=crop`}
                  alt={tarte.name}
                  loading="lazy"
                  style={{ width: "100%", height: 340, objectFit: "cover" }}
                />
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Reservation Page ─────────────────────────────────────────────────────────
function ReservationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    note: "",
    products: [] as string[],
  });

  const availableProducts = [
    "Pain au levain (6,50 €)",
    "Baguette tradition (1,40 €)",
    "Croissant pur beurre (1,80 €)",
    "Pain au chocolat (2,10 €)",
    "Kouign-amann (3,20 €)",
    "Tarte Tatin part (4,80 €)",
    "Tarte citron meringuée part (4,50 €)",
    "Mille-feuille (4,20 €)",
    "Brioche tressée (5,90 €)",
    "Box Week-end Découverte (18,90 €)",
  ];

  const toggleProduct = (p: string) => {
    setForm((prev) => ({
      ...prev,
      products: prev.products.includes(p)
        ? prev.products.filter((x) => x !== p)
        : [...prev.products, p],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section style={{ padding: "120px 80px", background: C.bg, fontFamily: FONT_BODY, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: "center", maxWidth: 520 }}
        >
          <div style={{ width: 80, height: 80, background: C.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <CheckCircle size={40} color={C.accent} />
          </div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: 34, fontWeight: 700, color: C.text, marginBottom: 16 }}>
            Votre commande est enregistrée !
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
            Merci <strong>{form.name}</strong> ! Nous vous confirmons votre commande pour le <strong>{form.date}</strong> à <strong>{form.time}</strong>. Vous recevrez un appel de confirmation au <strong>{form.phone}</strong>.
          </p>
          <motion.button
            type="button"
            onClick={() => setSubmitted(false)}
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: FONT_BODY }}
            whileHover={{ background: C.accentDark }}
            whileTap={{ scale: 0.97 }}
          >
            Passer une autre commande
          </motion.button>
        </motion.div>
      </section>
    );
  }

  return (
    <section style={{ padding: "100px 80px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Click & Collect
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 16 }}>
          Réserver votre commande
        </h1>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
          Choisissez vos produits, votre créneau de retrait et venez les chercher directement en boutique.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Product selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 18 }}>
            1. Choisissez vos produits
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {availableProducts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => toggleProduct(p)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: `2px solid ${form.products.includes(p) ? C.accent : C.border}`,
                  background: form.products.includes(p) ? C.accentLight : C.white,
                  color: form.products.includes(p) ? C.accent : C.text,
                  fontWeight: form.products.includes(p) ? 700 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: FONT_BODY,
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {form.products.includes(p) && <CheckCircle size={14} color={C.accent} />}
                {p}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Date & time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 18 }}>
            2. Créneau de retrait
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Heure</label>
              <select
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
              >
                <option value="">Choisir un créneau</option>
                {["07h00", "08h00", "09h00", "10h00", "11h00", "12h00", "14h00", "15h00", "16h00", "17h00", "18h00"].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Contact info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: 36 }}>
          <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 18 }}>
            3. Vos coordonnées
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Prénom & nom</label>
              <input
                type="text"
                required
                placeholder="Marie Dupont"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Téléphone</label>
              <input
                type="tel"
                required
                placeholder="06 12 34 56 78"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Note (optionnel)</label>
            <textarea
              rows={3}
              placeholder="Précisez vos préférences, allergies, demandes particulières..."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <motion.button
            type="submit"
            style={{ width: "100%", background: C.accent, color: C.white, border: "none", borderRadius: 12, padding: "18px", fontWeight: 700, fontSize: 18, cursor: "pointer", fontFamily: FONT_BODY }}
            whileHover={{ background: C.accentDark, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag size={20} style={{ marginRight: 10, verticalAlign: "middle" }} />
            Confirmer ma commande
          </motion.button>
        </motion.div>
      </form>
    </section>
  );
}

// ─── Atelier Page ─────────────────────────────────────────────────────────────
function AtelierPage({ goTo }: { goTo: (p: BoulPage) => void }) {
  const workshops = [
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
      desc: "Un moment magique pour initier les enfants au monde de la boulangerie artisanale. Dans une ambiance joyeuse et bienveillante, ils découvrent d'où vient le pain, comment la farine devient une pâte, et façonnent leur propre petit pain à emporter fièrement. Un souvenir inoubliable.",
      includes: ["Tablier enfant offert", "Pain façonné à emporter", "Diplôme de petit boulanger", "Goûter offert"],
    },
  ];

  return (
    <section style={{ padding: "100px 80px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Ateliers
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 16 }}>
          L'art de la boulangerie artisanale
        </h1>
        <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 620, margin: "0 auto 0", lineHeight: 1.7 }}>
          Venez apprendre l'art de la boulangerie artisanale dans notre fournil. Des ateliers conçus par Camille pour transmettre 37 ans de passion et de savoir-faire.
        </p>
      </motion.div>

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ maxWidth: 1000, margin: "40px auto 72px", borderRadius: 24, overflow: "hidden", position: "relative" }}
      >
        <img
          src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80&fit=crop"
          alt="Atelier boulangerie"
          loading="lazy"
          style={{ width: "100%", height: 320, objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(92,51,23,0.75) 0%, transparent 60%)` }} />
        <div style={{ position: "absolute", top: "50%", left: 48, transform: "translateY(-50%)" }}>
          <p style={{ fontFamily: FONT_HEADING, fontSize: "clamp(18px, 2.5vw, 30px)", color: C.white, fontStyle: "italic", maxWidth: 400, lineHeight: 1.4 }}>
            "Faire son pain, c'est retrouver quelque chose d'essentiel — le lien entre la terre, les mains et la table."
          </p>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 12, fontSize: 14 }}>— Camille Girard, boulangère</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, maxWidth: 1060, margin: "0 auto 60px" }}>
        {workshops.map((ws, i) => (
          <motion.div
            key={ws.title}
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -6, boxShadow: C.shadowLg }}
            style={{ background: C.white, borderRadius: 22, overflow: "hidden", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ background: C.bgSection, padding: "32px 28px 24px", borderBottom: `1px solid ${C.border}` }}>
              <TemplateIcon emoji={ws.emoji} size={44} />
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginTop: 16, marginBottom: 8 }}>{ws.title}</h2>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={13} color={C.accent} /> {ws.duration}
                </span>
                <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                  <Users size={13} color={C.accent} /> {ws.spots}
                </span>
                <span style={{ fontSize: 13, color: C.textMuted, display: "flex", alignItems: "center", gap: 5 }}>
                  <Calendar size={13} color={C.accent} /> {ws.schedule}
                </span>
              </div>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, marginBottom: 20 }}>{ws.desc}</p>
              <div style={{ marginBottom: 24 }}>
                {ws.includes.map((inc) => (
                  <div key={inc} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <CheckCircle size={14} color={C.accent} />
                    <span style={{ fontSize: 13, color: C.text }}>{inc}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: FONT_HEADING, fontWeight: 700, color: C.accent, fontSize: 20 }}>{ws.price}</span>
                <motion.button
                  type="button"
                  onClick={() => goTo("contact")}
                  style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT_BODY }}
                  whileHover={{ background: C.accentDark, scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Réserver
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ maxWidth: 640, margin: "0 auto", background: C.bgSection, borderRadius: 20, padding: "36px 40px", border: `1px solid ${C.border}`, textAlign: "center" }}
      >
        <h3 style={{ fontFamily: FONT_HEADING, fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 12 }}>Groupes & événements d'entreprise</h3>
        <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7, marginBottom: 24 }}>
          Vous souhaitez organiser un atelier pour votre équipe ou un événement privé ? Nous concevons des formules sur mesure pour 10 à 30 personnes, en dehors des heures d'ouverture.
        </p>
        <motion.button
          type="button"
          onClick={() => goTo("contact")}
          style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "14px 32px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: FONT_BODY }}
          whileHover={{ background: C.accentDark, scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Nous contacter pour un devis
        </motion.button>
      </motion.div>
    </section>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const horaires = [
    { day: "Mardi – Vendredi", time: "07h00 – 19h00" },
    { day: "Samedi", time: "07h00 – 19h00" },
    { day: "Dimanche", time: "07h00 – 13h00" },
    { day: "Lundi", time: "Fermé" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section style={{ padding: "100px 80px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Contact
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, color: C.text, letterSpacing: -0.5, marginBottom: 16 }}>
          Nous rendre visite
        </h1>
        <p style={{ fontSize: 16, color: C.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          Une question, une commande spéciale ou juste envie de nous dire bonjour — nous sommes là.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 60, maxWidth: 1040, margin: "0 auto" }}>
        {/* Info column */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 40 }}>
            {[
              { icon: <MapPin size={22} color={C.accent} />, title: "Adresse", text: "Adresse communiquée sur demande à contact@aevia.io" },
              { icon: <Phone size={22} color={C.accent} />, title: "Téléphone", text: "01 43 55 67 89" },
              { icon: <Mail size={22} color={C.accent} />, title: "Email", text: "contact@aevia.io" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 48, height: 48, background: C.accentLight, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: C.textMuted, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontWeight: 600, color: C.text, fontSize: 15 }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 18 }}>Horaires d'ouverture</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {horaires.map((h) => (
              <div
                key={h.day}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "13px 18px", borderRadius: 10,
                  background: h.time === "Fermé" ? C.bgSection : C.white,
                  border: `1px solid ${C.border}`,
                }}
              >
                <span style={{ fontWeight: 600, color: h.time === "Fermé" ? C.textMuted : C.text, fontSize: 14 }}>{h.day}</span>
                <span style={{ fontWeight: 700, color: h.time === "Fermé" ? C.textMuted : C.accent, fontSize: 14 }}>{h.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form column */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "60px 20px" }}
            >
              <CheckCircle size={48} color={C.accent} style={{ marginBottom: 24 }} />
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 26, fontWeight: 700, color: C.text, marginBottom: 14 }}>Message envoyé !</h3>
              <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.7 }}>
                Merci pour votre message. Nous vous répondrons dans les plus brefs délais à l'adresse <strong>{form.email}</strong>.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Nom</label>
                  <input
                    type="text"
                    required
                    placeholder="Marie Dupont"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Email</label>
                  <input
                    type="email"
                    required
                    placeholder="marie@exemple.fr"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Sujet</label>
                <input
                  type="text"
                  required
                  placeholder="Commande spéciale, renseignement..."
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Message</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Votre message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: FONT_BODY, color: C.text, background: C.white, outline: "none", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
              <motion.button
                type="submit"
                style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px", fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: FONT_BODY }}
                whileHover={{ background: C.accentDark, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Envoyer le message
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Legal Page ───────────────────────────────────────────────────────────────
function LegalPage({ type }: { type: "mentions" | "privacy" }) {
  if (type === "mentions") {
    return (
      <section style={{ padding: "100px 80px 80px", background: C.bg, fontFamily: FONT_BODY }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Légal
          </div>
          <h1 style={{ fontFamily: FONT_HEADING, fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 40, letterSpacing: -0.5 }}>Mentions légales</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Éditeur du site</h2>
              <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
                Ce site est édité par <strong>Aevia WS</strong>, auto-entrepreneur immatriculé sous le SIREN <strong>852 546 225</strong>, éditeur de sites web.<br />
                Contact : <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a><br />
                Adresse du siège social communiquée sur demande à <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>.
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Hébergement</h2>
              <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
                <strong>Vercel Inc.</strong><br />
                440 N Barranca Ave #4133, Covina, CA 91723, États-Unis<br />
                <a href="https://vercel.com" style={{ color: C.accent }}>vercel.com</a>
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Propriété intellectuelle</h2>
              <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
                L'ensemble des contenus présents sur ce site (textes, images, graphismes, logo) est la propriété exclusive de La Fournée et d'Aevia WS. Toute reproduction ou représentation, intégrale ou partielle, est interdite sans autorisation préalable.
              </p>
            </div>
            <div>
              <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Responsabilité</h2>
              <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
                Aevia WS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site, dont elle se réserve le droit de corriger le contenu à tout moment. Aevia WS décline toutefois toute responsabilité pour les omissions, inexactitudes et carences dans la mise à jour.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section style={{ padding: "100px 80px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 20, textTransform: "uppercase", letterSpacing: 0.8 }}>
          RGPD
        </div>
        <h1 style={{ fontFamily: FONT_HEADING, fontSize: 40, fontWeight: 700, color: C.text, marginBottom: 40, letterSpacing: -0.5 }}>Politique de confidentialité</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Responsable du traitement</h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
              Aevia WS, SIREN 852 546 225. Contact : <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Données collectées</h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
              Dans le cadre de l'utilisation de ce site, nous sommes susceptibles de collecter les données suivantes : nom et prénom, adresse email, numéro de téléphone, données de navigation. Ces données sont collectées uniquement lors de votre soumission de formulaires (commandes, contacts, ateliers).
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Finalité des traitements</h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
              Les données collectées sont utilisées exclusivement pour : traiter vos commandes et demandes de réservation, répondre à vos messages, vous informer des ateliers auxquels vous vous êtes inscrits. Nous ne commercialisons ni ne partageons vos données avec des tiers.
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Conservation des données</h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
              Vos données sont conservées pendant une durée maximale de 3 ans à compter de votre dernière interaction avec notre site, conformément aux obligations légales.
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Vos droits</h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez-nous à <a href="mailto:contact@aevia.io" style={{ color: C.accent }}>contact@aevia.io</a>.
            </p>
          </div>
          <div>
            <h2 style={{ fontFamily: FONT_HEADING, fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 12 }}>Cookies</h2>
            <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8 }}>
              Ce site n'utilise pas de cookies de traçage publicitaire. Des cookies techniques strictement nécessaires au bon fonctionnement du site peuvent être déposés sur votre terminal.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Hero (home) ──────────────────────────────────────────────────────────────
function Hero({ goTo }: { goTo: (p: BoulPage) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      style={{ minHeight: "100vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", fontFamily: FONT_BODY }}
    >
      <motion.div style={{ position: "absolute", inset: 0, zIndex: 0, background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bgLight} 50%, ${C.cream} 100%)`, scale: bgScale }} />
      <div style={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.accentLight} 0%, transparent 70%)`, opacity: 0.6, zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 350, height: 350, borderRadius: "50%", background: `radial-gradient(circle, ${C.cream} 0%, transparent 70%)`, zIndex: 0 }} />
      <motion.div
        style={{ position: "absolute", right: "8%", top: "50%", transform: "translateY(-50%)", opacity: 0.12, zIndex: 0, userSelect: "none" }}
        animate={{ rotate: [0, 3, 0, -3, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <TemplateIcon emoji="🥖" size={180} />
      </motion.div>

      <motion.div style={{ position: "relative", zIndex: 1, padding: "120px 80px 80px", maxWidth: 760, y: textY, opacity: textOpacity }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.accentLight, border: `1px solid ${C.accent}`, borderRadius: 20, padding: "7px 16px", marginBottom: 28 }}
        >
          <Leaf size={14} color={C.accent} />
          <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>Artisan boulanger depuis 1987 · Paris 11e</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          style={{ fontFamily: FONT_HEADING, fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 700, color: C.text, lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 24 }}
        >
          Le pain, l'art,{" "}
          <em style={{ color: C.accent, fontStyle: "italic" }}>la tradition</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}
          style={{ fontSize: 19, color: C.textMuted, lineHeight: 1.76, marginBottom: 40, maxWidth: 560 }}
        >
          La Fournée, c'est l'amour du pain au levain, des viennoiseries pur beurre et des pâtisseries
          de saison. Tout est fait maison chaque jour dès 4h du matin dans notre fournil ouvert sur la rue.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.32 }}
          style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 52 }}
        >
          <motion.button
            type="button"
            onClick={() => goTo("reservation")}
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 10, padding: "16px 34px", fontWeight: 700, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY }}
            whileHover={{ background: C.accentDark, scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingBag size={19} /> Commander en ligne
          </motion.button>
          <motion.button
            type="button"
            onClick={() => goTo("boutique")}
            style={{ background: "transparent", color: C.text, border: `2px solid ${C.border}`, borderRadius: 10, padding: "14px 28px", fontWeight: 600, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_BODY }}
            whileHover={{ borderColor: C.accent, color: C.accent }}
            whileTap={{ scale: 0.97 }}
          >
            Notre carte <ChevronRight size={18} />
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ display: "flex", gap: 36 }}>
          {[{ value: "37 ans", label: "De savoir-faire" }, { value: "4.9★", label: "Google Avis" }, { value: "100%", label: "Fait maison" }].map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 24, color: C.accent }}>{s.value}</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Menu Categories (home section) ──────────────────────────────────────────
const CATEGORIES = [
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

function MenuSection({ goTo }: { goTo: (p: BoulPage) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section id="menu" ref={ref} style={{ padding: "100px 80px", background: C.bg, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Notre carte
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Fait avec amour, chaque matin
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
        style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 44 }}
      >
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.name}
            type="button"
            onClick={() => setActiveCategory(i)}
            style={{
              background: activeCategory === i ? C.accent : C.white,
              color: activeCategory === i ? C.white : C.text,
              border: `1.5px solid ${activeCategory === i ? C.accent : C.border}`,
              borderRadius: 25, padding: "10px 22px",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
              fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 8,
              transition: "all 0.2s",
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <TemplateIcon emoji={cat.emoji} size={18} />
            {cat.name}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}
        >
          {CATEGORIES[activeCategory].items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5, boxShadow: C.shadowLg }}
              style={{ background: C.bgSection, borderRadius: 16, padding: "24px 26px", border: `1px solid ${C.border}`, boxShadow: C.shadow }}
            >
              <h3 style={{ fontFamily: FONT_HEADING, fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>{item.name}</h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.6, marginBottom: 16 }}>{item.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, color: C.accent, fontSize: 18, fontFamily: FONT_HEADING }}>{item.price}</div>
                <motion.button
                  type="button"
                  onClick={() => goTo("reservation")}
                  style={{ background: C.accentLight, color: C.accent, border: "none", borderRadius: 7, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT_BODY }}
                  whileHover={{ background: C.accent, color: C.white }}
                  whileTap={{ scale: 0.97 }}
                >
                  Commander
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} style={{ textAlign: "center", marginTop: 44 }}>
        <motion.button
          type="button"
          onClick={() => goTo("boutique")}
          style={{ background: "transparent", color: C.accent, border: `2px solid ${C.accent}`, borderRadius: 10, padding: "13px 30px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT_BODY }}
          whileHover={{ background: C.accent, color: C.white }}
          whileTap={{ scale: 0.97 }}
        >
          Voir tout le catalogue →
        </motion.button>
      </motion.div>
    </section>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────
function Story() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
          <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 24, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Notre histoire
          </div>
          <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 700, color: C.text, lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 24 }}>
            Une boulangerie de quartier, <em style={{ color: C.accent }}>depuis 1987</em>
          </h2>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 20 }}>
            La Fournée est née de la passion de Marcel Girard pour le pain au levain naturel. À l'époque où les industriels envahissaient les boulangeries, Marcel choisissait l'artisanat, la lenteur et le respect des céréales.
          </p>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.8, marginBottom: 32 }}>
            Aujourd'hui, sa fille Camille perpétue cet héritage avec la même exigence : farines Label Rouge, beurre AOP, levain vivant nourri depuis 20 ans. Chaque baguette est façonnée à la main, chaque croissant feuilleté à la main.
          </p>
          <div style={{ display: "flex", gap: 28 }}>
            {[
              { icon: <Leaf size={18} color="#d4832a" />, text: "Farines Bio Label Rouge" },
              { icon: <Heart size={18} color="#d4832a" />, text: "Beurre AOP Poitou" },
              { icon: <Award size={18} color="#d4832a" />, text: "Meilleur artisan 2023" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center" }}>
                <div style={{ width: 44, height: 44, background: C.accentLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, lineHeight: 1.3 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {["🥐", "🍞", "🎂", "🥖"].map((emoji, i) => (
            <motion.div
              key={i}
              style={{ background: C.cream, borderRadius: 20, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}` }}
              whileHover={{ scale: 1.05, y: -4 }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              <TemplateIcon emoji={emoji} size={60} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const stats = [
    { value: "37 ans", label: "De savoir-faire artisanal", emoji: "🏆" },
    { value: "4.9★", label: "Note Google Maps", emoji: "⭐" },
    { value: "300+", label: "Commandes par jour", emoji: "🥖" },
    { value: "20 ans", label: "Notre levain naturel", emoji: "🌾" },
  ];
  return (
    <section ref={ref} style={{ padding: "90px 80px", background: C.text, fontFamily: FONT_BODY }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, maxWidth: 960, margin: "0 auto" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{ marginBottom: 12 }}><TemplateIcon emoji={s.emoji} size={36} /></div>
            <div style={{ fontFamily: FONT_HEADING, fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 700, color: C.white, marginBottom: 8 }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Isabelle T.", text: "La meilleure baguette tradition de Paris, sans hésitation. Le croissant est à se damner — feuilleté, aérien, pur beurre. J'y vais chaque samedi matin depuis 8 ans.", stars: 5 },
  { name: "Grégoire M.", text: "L'abonnement hebdomadaire est une révélation. Du pain frais sans y penser, livré directement en boutique avant mon passage. Qualité constante, équipe adorable.", stars: 5 },
  { name: "Sakina B.", text: "J'ai commandé le plateau prestige pour l'anniversaire de ma mère — succès total. Chaque pâtisserie était un chef-d'œuvre de saveurs. Merci Camille !", stars: 5 },
];

function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          Avis clients
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Ils nous font confiance
        </h2>
      </motion.div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            style={{ background: C.white, borderRadius: 18, padding: 28, border: `1px solid ${C.border}`, boxShadow: C.shadow }}
          >
            <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
              {Array.from({ length: t.stars }).map((_, k) => (<Star key={k} size={14} color={C.accent} fill={C.accent} />))}
            </div>
            <p style={{ fontSize: 15, color: C.text, lineHeight: 1.72, marginBottom: 20, fontStyle: "italic", fontFamily: FONT_HEADING }}>"{t.text}"</p>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.accent }}>— {t.name}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "Proposez-vous la livraison à domicile ?", a: "Oui, nous livrons dans un rayon de 3 km du mardi au samedi, de 8h à 12h. Commandez en ligne avant 20h la veille. Livraison offerte à partir de 25 € d'achat." },
  { q: "Puis-je commander des pâtisseries personnalisées ?", a: "Absolument ! Camille réalise des gâteaux sur commande pour vos anniversaires, mariages et événements professionnels. Délai minimum : 5 jours ouvrés. Contactez-nous pour un devis gratuit." },
  { q: "Utilisez-vous des farines biologiques ?", a: "Nous utilisons principalement des farines Label Rouge provenant de moulins français. Notre farine de tradition T65 vient du Moulin Decollogne en Bourgogne. Certains pains spéciaux sont en agriculture biologique certifiée." },
  { q: "Avez-vous des produits sans gluten ou végans ?", a: "Nous proposons quelques références véganes (pain aux céréales, brioche végane). Pour le sans gluten, nos équipements partagés ne permettent pas de garantir l'absence totale de contamination croisée." },
  { q: "Comment fonctionne l'abonnement pain hebdomadaire ?", a: "Vous choisissez votre pain favori, votre fréquence (5j/7 ou 3j/7) et un créneau de récupération. Facturation mensuelle, résiliable à tout moment. -10 % garanti." },
];

function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section ref={ref} style={{ padding: "100px 80px", background: C.bgSection, fontFamily: FONT_BODY }}>
      <motion.div initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} style={{ textAlign: "center", marginBottom: 60 }}>
        <div style={{ display: "inline-block", background: C.accentLight, color: C.accent, borderRadius: 20, padding: "6px 18px", fontSize: 13, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 0.8 }}>
          FAQ
        </div>
        <h2 style={{ fontFamily: FONT_HEADING, fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 700, color: C.text, letterSpacing: -0.5 }}>
          Vos questions, nos réponses
        </h2>
      </motion.div>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            style={{ background: C.white, borderRadius: 14, border: `1px solid ${open === i ? C.accent : C.border}`, overflow: "hidden", transition: "border-color 0.2s" }}
          >
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", padding: "20px 24px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, textAlign: "left", fontFamily: FONT_BODY }}
            >
              <span style={{ fontWeight: 600, fontSize: 16, color: C.text, lineHeight: 1.4 }}>{faq.q}</span>
              <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ flexShrink: 0 }}>
                <ChevronDown size={20} color={open === i ? C.accent : C.textMuted} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
                  <div style={{ padding: "0 24px 22px", fontSize: 15, color: C.textMuted, lineHeight: 1.72 }}>{faq.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function Impact33() {
  const [page, setPage] = useState<BoulPage>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const goTo = (p: BoulPage) => {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks: { label: string; key: BoulPage }[] = [
    { label: "La Boutique", key: "boutique" },
    { label: "Nos Tartes", key: "tartes" },
    { label: "Commande", key: "reservation" },
    { label: "Ateliers", key: "atelier" },
    { label: "Contact", key: "contact" },
  ];

  return (
    <div style={{ background: C.bg, overflowX: "clip" }}>
      {/* ── Nav (always visible) ── */}
      <motion.nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          padding: "0 48px", height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: scrolled || page !== "home" ? "rgba(253,248,240,0.97)" : "transparent",
          backdropFilter: scrolled || page !== "home" ? "blur(12px)" : "none",
          borderBottom: scrolled || page !== "home" ? `1px solid ${C.border}` : "none",
          boxShadow: scrolled || page !== "home" ? C.shadow : "none",
          transition: "all 0.3s ease", fontFamily: FONT_BODY,
        }}
      >
        <motion.button
          type="button"
          onClick={() => goTo("home")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "none", border: "none", padding: 0 }}
          whileHover={{ scale: 1.03 }}
        >
          <div style={{ width: 40, height: 40, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TemplateIcon emoji="🥖" size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 20, color: C.text, lineHeight: 1 }}>La Fournée</div>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Artisan Boulanger</div>
          </div>
        </motion.button>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map((link) => (
            <motion.button
              key={link.key}
              type="button"
              onClick={() => goTo(link.key)}
              style={{
                color: page === link.key ? C.accent : C.text,
                fontWeight: page === link.key ? 700 : 400,
                fontSize: 15,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: FONT_BODY,
                padding: 0,
                borderBottom: page === link.key ? `2px solid ${C.accent}` : "2px solid transparent",
                paddingBottom: 2,
              }}
              whileHover={{ color: C.accent }}
              transition={{ duration: 0.15 }}
            >
              {link.label}
            </motion.button>
          ))}
          <motion.button
            type="button"
            onClick={() => goTo("reservation")}
            style={{ background: C.accent, color: C.white, border: "none", borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: FONT_BODY, display: "flex", alignItems: "center", gap: 7 }}
            whileHover={{ background: C.accentDark, scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <ShoppingBag size={16} />
            Commander
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: C.text }}
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: "fixed", top: 72, left: 0, right: 0, zIndex: 99, background: C.bg, padding: "24px 48px", borderBottom: `1px solid ${C.border}`, boxShadow: C.shadow, fontFamily: FONT_BODY }}
          >
            <button type="button" onClick={() => goTo("home")} style={{ display: "block", width: "100%", padding: "12px 0", color: C.text, background: "none", border: "none", borderBottom: `1px solid ${C.border}`, textAlign: "left", fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: FONT_BODY }}>Accueil</button>
            {navLinks.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => goTo(link.key)}
                style={{ display: "block", width: "100%", padding: "12px 0", color: page === link.key ? C.accent : C.text, background: "none", border: "none", borderBottom: `1px solid ${C.border}`, textAlign: "left", fontWeight: page === link.key ? 700 : 500, fontSize: 15, cursor: "pointer", fontFamily: FONT_BODY }}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Home page */}
          {page === "home" && (
            <>
              <Hero goTo={goTo} />
              <section style={{ padding: "48px 0", background: C.bgSection, overflow: "hidden" }}>
                <div style={{ textAlign: "center", marginBottom: 28, fontFamily: FONT_HEADING, fontSize: 16, color: C.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>
                  Nos créations du moment
                </div>
                <Marquee />
              </section>
              <MenuSection goTo={goTo} />
              <Story />
              <Stats />
              <Testimonials />
              <FAQ />
            </>
          )}

          {/* Sub pages */}
          {page === "boutique" && <BoutiquePage goTo={goTo} />}
          {page === "tartes" && <TartesPage goTo={goTo} />}
          {page === "reservation" && <ReservationPage />}
          {page === "atelier" && <AtelierPage goTo={goTo} />}
          {page === "contact" && <ContactPage />}
          {page === "mentions" && <LegalPage type="mentions" />}
          {page === "privacy" && <LegalPage type="privacy" />}
        </motion.div>
      </AnimatePresence>

      {/* ── Footer (always visible) ── */}
      <footer style={{ background: C.brown, color: C.white, padding: "70px 80px 32px", fontFamily: FONT_BODY }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 52 }}>
          <div>
            <motion.button
              type="button"
              onClick={() => goTo("home")}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              whileHover={{ opacity: 0.85 }}
            >
              <div style={{ width: 40, height: 40, background: C.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}><TemplateIcon emoji="🥖" size={20} color="#fff" /></div>
              <div>
                <div style={{ fontFamily: FONT_HEADING, fontWeight: 700, fontSize: 20, color: C.white }}>La Fournée</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 1.5, textTransform: "uppercase" }}>Artisan Boulanger</div>
              </div>
            </motion.button>
            <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 15, lineHeight: 1.65, marginBottom: 24 }}>
              Boulangerie artisanale au levain naturel depuis 1987. Chaque jour, nous pétrissons, façonnons et cuisons avec passion pour votre quartier.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {[
                { icon: <MapPin size={15} />, text: "Adresse communiquée sur demande à contact@aevia.io" },
                { icon: <Mail size={15} />, text: "contact@aevia.io" },
                { icon: <Clock size={15} />, text: "Mar–Sam 7h–19h | Dim 7h–13h | Lun Fermé" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: "rgba(255,255,255,0.62)", fontSize: 14 }}>
                  <span style={{ color: C.accent, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase", letterSpacing: 0.8 }}>Notre carte</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "La Boutique", key: "boutique" as BoulPage },
                { label: "Nos Tartes", key: "tartes" as BoulPage },
                { label: "Ateliers", key: "atelier" as BoulPage },
              ].map((l) => (
                <button key={l.key} type="button" onClick={() => goTo(l.key)} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0, fontFamily: FONT_BODY }}>{l.label}</button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase", letterSpacing: 0.8 }}>Services</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Commander en ligne", key: "reservation" as BoulPage },
                { label: "Ateliers", key: "atelier" as BoulPage },
                { label: "Nous contacter", key: "contact" as BoulPage },
              ].map((l) => (
                <button key={l.key} type="button" onClick={() => goTo(l.key)} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0, fontFamily: FONT_BODY }}>{l.label}</button>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 20, color: C.white, textTransform: "uppercase", letterSpacing: 0.8 }}>La boulangerie</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Notre histoire", key: "home" as BoulPage },
                { label: "Contact", key: "contact" as BoulPage },
                { label: "Ateliers", key: "atelier" as BoulPage },
              ].map((l) => (
                <button key={l.label} type="button" onClick={() => goTo(l.key)} style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, background: "none", border: "none", textAlign: "left", cursor: "pointer", padding: 0, fontFamily: FONT_BODY }}>{l.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 14 }}>© 2025 La Fournée · Artisan Boulanger Paris. Tous droits réservés. Site réalisé par <a href="mailto:contact@aevia.io" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Aevia WS</a>.</p>
          <div style={{ display: "flex", gap: 20 }}>
            <button type="button" onClick={() => goTo("mentions")} style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, background: "none", border: "none", cursor: "pointer", fontFamily: FONT_BODY }}>Mentions légales</button>
            <button type="button" onClick={() => goTo("privacy")} style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, background: "none", border: "none", cursor: "pointer", fontFamily: FONT_BODY }}>Confidentialité</button>
            <button type="button" onClick={() => goTo("contact")} style={{ color: "rgba(255,255,255,0.38)", fontSize: 13, background: "none", border: "none", cursor: "pointer", fontFamily: FONT_BODY }}>Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
