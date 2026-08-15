"use client";
import { resolveList } from "@/lib/templates/resolveList";
// @ts-nocheck

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {useRef, useState, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import {
  clientCity,
  clientFaq,
  clientHeroLine,
  clientName,
  clientPhotos,
  clientReviews,
  clientServices,
  clientStats,
  clientText,
  clientWorks,
} from "@/lib/templates/clientContent";
let sessionData: any = null;

// Variables de module lues par les sections extraites en composants :
// déclarées ici pour que tout le fichier puisse s'y référer.
// Global state variables for subpage compatibility
let fd: any = null;

// La FAQ, jusqu'ici écrit(e) dans le rendu :
// le client pouvait les saisir, le thème ne les lisait pas.
const FAQ_INLINE_SOURCE = [
  { q: "Quels sont les délais de livraison ?", a: "Livraison standard : 2-3 jours ouvrés gratuite dès 200€. Express 24h disponible pour 12€ en France métropolitaine. Les produits en stock partent le jour même si la commande est passée avant 14h. Livraison internationale disponible dans 38 pays." },
              { q: "Quelle est votre politique de retour ?", a: "30 jours de retour gratuit, sans questions. Si votre produit présente un défaut ou ne vous convient pas, nous prenons en charge l'enlèvement à domicile et le remboursement intégral sous 5 jours ouvrés. Aucun frais de restockage." },
              { q: "Vos produits sont-ils garantis ?", a: "Tous nos produits bénéficient d'une garantie constructeur de 2 ans minimum, extensible à 5 ans avec notre programme NeuroSafe. En cas de panne, nous vous remplaçons le produit sous 48h sans attendre la fin du diagnostic." },
              { q: "Proposez-vous des facilités de paiement ?", a: "Oui — paiement en 3x ou 12x sans frais disponible dès 150€ via notre partenaire Alma. Paiement en 24x pour les produits à partir de 1 000€. Aucun justificatif ni formulaire papier — tout se fait en 30 secondes à la caisse." },
              { q: "Comment contacter le support ?", a: "Chat en direct disponible 7j/7 de 8h à 23h. Email avec réponse garantie en moins de 2h en semaine, 4h le week-end. Pour les produits sous garantie, ligne prioritaire au " + (fd?.phone ?? "01 88 32 31 28") + ". Notre NPS client est de 78 — on ne dit pas ça pour rien." }
];
let FAQ_INLINE = FAQ_INLINE_SOURCE;

let c: any = null;
let brand: any = null;

/* ============================================================
   DATA
   ============================================================ */

function HERO_PRODUCTS_DEMO_SOURCE_LIVE() {
  return [
  {
    id: 1,
    name: "Helix Noir",
    collection: "Monochrome Series",
    price: "€8 400",
    desc: "Boîtier grade 5 titane poli miroir. Mouvement mécanique automatique 72h de réserve. Verre saphir anti-reflets.",
    badge: "Édition Limitée — 150 pièces",
    img: (clientPhotos(sessionData)[0] || "https://images.pexels.com/photos/12915488/pexels-photo-12915488.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    accent: "#0a0a0a",
  },
  {
    id: 2,
    name: "Aurora S",
    collection: "Aurora Dial Series",
    price: "€12 900",
    desc: "Cadran en nacre rose naturelle. Complications : date, phases de lune. Bracelet alligator bordeaux cousu main.",
    badge: "New Season",
    img: (clientPhotos(sessionData)[1] || "https://images.pexels.com/photos/1228517/pexels-photo-1228517.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    accent: "var(--brand,#8B0000)",
  },
  {
    id: 3,
    name: "Meridian GMT",
    collection: "Exploration Series",
    price: "€15 600",
    desc: "Fonction GMT double fuseau. Céramique haute pression noire absolue. Étanchéité 300m. Certifié COSC.",
    badge: "Best-Seller",
    img: (clientPhotos(sessionData)[2] || "https://images.pexels.com/photos/4484237/pexels-photo-4484237.jpeg?auto=compress&cs=tinysrgb&w=1200"),
    accent: "#1a3a5c",
  },
];
}
let HERO_PRODUCTS_DEMO_SOURCE = HERO_PRODUCTS_DEMO_SOURCE_LIVE();
let HERO_PRODUCTS_DEMO = HERO_PRODUCTS_DEMO_SOURCE;
let HERO_PRODUCTS = HERO_PRODUCTS_DEMO;

function PRODUCTS_SOURCE_LIVE() {
  return /* REALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ name: o.title, category: o.detail || undefined, ...(o.imageUrl ? { img: o.imageUrl } : {}) })), [
  {
    id: 1,
    name: "Helix Noir",
    price: "€8 400",
    isNew: false,
    img: (clientPhotos(sessionData)[3] || "https://images.pexels.com/photos/12915488/pexels-photo-12915488.jpeg?auto=compress&cs=tinysrgb&w=800"),
    category: "Monochrome",
  },
  {
    id: 2,
    name: "Aurora S",
    price: "€12 900",
    isNew: true,
    img: (clientPhotos(sessionData)[4] || "https://images.pexels.com/photos/1228517/pexels-photo-1228517.jpeg?auto=compress&cs=tinysrgb&w=800"),
    category: "Cadrans",
  },
  {
    id: 3,
    name: "Meridian GMT",
    price: "€15 600",
    isNew: false,
    img: (clientPhotos(sessionData)[5] || "https://images.pexels.com/photos/4484237/pexels-photo-4484237.jpeg?auto=compress&cs=tinysrgb&w=800"),
    category: "Exploration",
  },
  {
    id: 4,
    name: "Solstice Blanc",
    price: "€6 200",
    isNew: true,
    img: (clientPhotos(sessionData)[6] || "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800&auto=format&fit=crop"),
    category: "Classique",
  },
  {
    id: 5,
    name: "Vertex Chronograph",
    price: "€19 800",
    isNew: false,
    img: (clientPhotos(sessionData)[7] || "https://images.unsplash.com/photo-1461141346587-763ab02bced9?q=80&w=800&auto=format&fit=crop"),
    category: "Chronographe",
  },
  {
    id: 6,
    name: "Onyx Perpetual",
    price: "€24 500",
    isNew: false,
    img: (clientPhotos(sessionData)[8] || "https://images.pexels.com/photos/12915488/pexels-photo-12915488.jpeg?auto=compress&cs=tinysrgb&w=800"),
    category: "Grande Complication",
  },
]);
}
let PRODUCTS_SOURCE = PRODUCTS_SOURCE_LIVE();
let PRODUCTS = PRODUCTS_SOURCE;

function MATERIALS_DEMO_SOURCE_LIVE() {
  return [
  {
    name: "Swiss Movement",
    subtitle: "ETA 2824-2 / In-house",
    desc: "Chaque calibre est assemblé à la main par nos maîtres horlogers à Genève. Réglage chronomètre, 6 positions. Réserve de marche minimum 48h.",
    img: (clientPhotos(sessionData)[9] || "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=800&auto=format&fit=crop"),
  },
  {
    name: "Sapphire Crystal",
    subtitle: "Grade 9 · Anti-reflective",
    desc: "Verre saphir synthétique de grade 9, traitement anti-reflets double face. Dureté Mohs 9/10 — résistant aux rayures du quotidien.",
    img: (clientPhotos(sessionData)[10] || "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800&auto=format&fit=crop"),
  },
  {
    name: "Grade 5 Titanium",
    subtitle: "Ti6Al4V · DLC Coated",
    desc: "Alliage aérospatial grade 5 (Ti-6Al-4V), 40% plus léger que l'acier, 3× plus résistant. Revêtement DLC noir 5 microns en option.",
    img: (clientPhotos(sessionData)[11] || "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop"),
  },
  {
    name: "Alligator Strap",
    subtitle: "Mississippi · Cousu main",
    desc: "Cuir alligator du Mississippi tannage végétal, cousu main double fil de soie, doublure veau nappa. Boucle déployante en titane massif.",
    img: (clientPhotos(sessionData)[12] || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop"),
  },
];
}
let MATERIALS_DEMO_SOURCE = MATERIALS_DEMO_SOURCE_LIVE();
let MATERIALS_DEMO = MATERIALS_DEMO_SOURCE;
let MATERIALS = MATERIALS_DEMO;

function BESTSELLERS_DEMO_SOURCE_LIVE() {
  return [
  {
    name: "Meridian GMT",
    price: "€15 600",
    img: (clientPhotos(sessionData)[13] || "https://images.pexels.com/photos/4484237/pexels-photo-4484237.jpeg?auto=compress&cs=tinysrgb&w=800"),
    specs: [
      { label: "Mouvement", val: "Automatique In-house" },
      { label: "Boîtier", val: "Titane grade 5, 42mm" },
      { label: "Verre", val: "Saphir AR double face" },
      { label: "Étanchéité", val: "300m / 30ATM" },
      { label: "Réserve de marche", val: "72 heures" },
    ],
  },
  {
    name: "Aurora S",
    price: "€12 900",
    img: (clientPhotos(sessionData)[14] || "https://images.pexels.com/photos/1228517/pexels-photo-1228517.jpeg?auto=compress&cs=tinysrgb&w=800"),
    specs: [
      { label: "Mouvement", val: "ETA 2892 modifié" },
      { label: "Cadran", val: "Nacre rose naturelle" },
      { label: "Complications", val: "Date, Phase de Lune" },
      { label: "Bracelet", val: "Alligator bordeaux cousu main" },
      { label: "Boîtier", val: "Or rose 18k, 38mm" },
    ],
  },
  {
    name: "Onyx Perpetual",
    price: "€24 500",
    img: (clientPhotos(sessionData)[15] || "https://images.pexels.com/photos/12915488/pexels-photo-12915488.jpeg?auto=compress&cs=tinysrgb&w=800"),
    specs: [
      { label: "Mouvement", val: "Calendrier Perpétuel maison" },
      { label: "Complications", val: "Quantième perpétuel, Chrono" },
      { label: "Boîtier", val: "Céramique noire, 44mm" },
      { label: "Verre", val: "Saphir bombé, AR 4 couches" },
      { label: "Réserve de marche", val: "90 heures" },
    ],
  },
];
}
let BESTSELLERS_DEMO_SOURCE = BESTSELLERS_DEMO_SOURCE_LIVE();
let BESTSELLERS_DEMO = BESTSELLERS_DEMO_SOURCE;
let BESTSELLERS = BESTSELLERS_DEMO;

const PUBLICATIONS = [
  "Le Monde",
  "Vogue France",
  "Forbes",
  "The Telegraph",
  "Hodinkee",
  "GQ France",
];

const GUARANTEES_SOURCE = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "5 ans de garantie",
    desc: "Couverture complète : mouvement, boîtier, étanchéité. Extension possible à 7 ans.",
  },
  {
    icon: <RotateCcw className="w-5 h-5" />,
    title: "Retours gratuits",
    desc: "30 jours pour changer d'avis. Retrait à domicile inclus, remboursement sous 48h.",
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: "Certificat d'authenticité",
    desc: "Numéro de série gravé, certificat COSC, passeport de la montre en NFT optionnel.",
  },
  {
    icon: <Truck className="w-5 h-5" />,
    title: "White Glove Delivery",
    desc: "Livraison en main propre par coursier sécurisé. Emballage signature coffret bois.",
  },
];
let GUARANTEES = GUARANTEES_SOURCE;


/* ============================================================
   CART / CHECKOUT — helpers & types
   ============================================================ */

type CartItem = {
  key: string;
  id: number;
  name: string;
  price: number;
  qty: number;
  strap: string;
  size: string;
  img: string;
};

type SelectableProduct = { id: number; name: string; price: string; img: string };

const STRAP_OPTIONS = ["Alligator noir", "Alligator bordeaux", "Acier milanais", "Caoutchouc noir"];
const SIZE_OPTIONS = ["38mm", "40mm", "42mm", "44mm"];

function parsePriceToNumber(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatEUR(n: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

/* ── Variant selection modal — required before add-to-cart ────────────── */
function ProductVariantModal({
  product,
  onClose,
  onAdd,
}: {
  product: SelectableProduct | null;
  onClose: () => void;
  onAdd: (strap: string, size: string, qty: number) => void;
}) {
  const [strap, setStrap] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setStrap("");
    setSize("");
    setQty(1);
  }, [product?.id]);

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            key="pv-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[300]"
          />
          <motion.div
            key="pv-panel"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`Choisir les options — ${product.name}`}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 max-w-md w-full mx-auto bg-white rounded-xl z-[310] max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="absolute top-3 right-3 z-10 w-11 h-11 flex items-center justify-center bg-white/90 rounded-full cursor-pointer border-none hover:bg-white transition-colors"
              >
                <X className="w-4 h-4 text-[#0a0a0a]" />
              </button>
              <div className="relative aspect-[4/3] bg-[#f5f5f5] rounded-t-xl overflow-hidden">
                <Image src={product.img} alt={product.name} fill className="object-cover" />
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onAdd(strap, size, qty);
                }}
                className="p-6"
              >
                <p className="font-black text-[#0a0a0a] uppercase tracking-tight text-lg mb-1">{product.name}</p>
                <p className="font-bold text-[#0a0a0a]/60 text-sm mb-6">{product.price}</p>

                <label htmlFor="pv-strap" className="block text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/50 mb-2">
                  Bracelet
                </label>
                <select
                  id="pv-strap"
                  name="strap"
                  required
                  value={strap}
                  onChange={(e) => setStrap(e.target.value)}
                  className="w-full mb-5 px-4 py-3.5 border border-[#0a0a0a]/15 rounded-lg text-sm text-[#0a0a0a] bg-white cursor-pointer focus:outline-none focus:border-[#0a0a0a] transition-colors"
                >
                  <option value="" disabled>Choisir un bracelet</option>
                  {STRAP_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <label htmlFor="pv-size" className="block text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/50 mb-2">
                  Taille du boîtier
                </label>
                <select
                  id="pv-size"
                  name="size"
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full mb-5 px-4 py-3.5 border border-[#0a0a0a]/15 rounded-lg text-sm text-[#0a0a0a] bg-white cursor-pointer focus:outline-none focus:border-[#0a0a0a] transition-colors"
                >
                  <option value="" disabled>Choisir une taille</option>
                  {SIZE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/50">Quantité</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Diminuer la quantité"
                      className="w-11 h-11 flex items-center justify-center border border-[#0a0a0a]/15 rounded-lg cursor-pointer hover:border-[#0a0a0a] transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Augmenter la quantité"
                      className="w-11 h-11 flex items-center justify-center border border-[#0a0a0a]/15 rounded-lg cursor-pointer hover:border-[#0a0a0a] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[44px] flex items-center justify-center gap-3 px-8 py-4 bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#333] transition-all cursor-pointer border-none"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ajouter au panier
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Cart drawer — line items, total, checkout, confirmation ──────────── */
function CartDrawer({
  open,
  onClose,
  cart,
  onRemove,
  step,
  onStartCheckout,
  loading,
  onSubmitCheckout,
  onReset,
}: {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (key: string) => void;
  step: "cart" | "checkout" | "success";
  onStartCheckout: () => void;
  loading: boolean;
  onSubmitCheckout: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[300]"
          />
          <motion.div
            key="cart-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label="Panier"
            className="fixed top-0 right-0 bottom-0 z-[310] w-full sm:w-[420px] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#0a0a0a]/10">
              <h3 className="font-black uppercase tracking-tight text-[#0a0a0a]">
                {step === "checkout" ? "Livraison" : step === "success" ? "Commande" : `Panier (${count})`}
              </h3>
              <button
                onClick={onClose}
                aria-label="Fermer le panier"
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5 text-[#0a0a0a]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AnimatePresence mode="wait">
                {step === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
                      className="w-14 h-14 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="w-6 h-6" />
                    </motion.div>
                    <h4 className="font-black uppercase tracking-tight text-[#0a0a0a] text-lg mb-3">Commande confirmée</h4>
                    <p className="text-sm text-[#0a0a0a]/50 leading-relaxed mb-8">
                      Merci pour votre commande. Notre concierge vous contactera sous 24h pour organiser la livraison sécurisée white glove.
                    </p>
                    <button
                      onClick={onReset}
                      className="w-full min-h-[44px] px-8 py-4 bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#333] transition-all cursor-pointer border-none"
                    >
                      Fermer
                    </button>
                  </motion.div>
                ) : step === "checkout" ? (
                  <motion.form
                    key="checkout"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={onSubmitCheckout}
                  >
                    <div className="mb-5">
                      <label htmlFor="co-name" className="block text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/50 mb-2">
                        Nom complet
                      </label>
                      <input
                        id="co-name"
                        name="name"
                        type="text"
                        required
                        placeholder="Jean Dupont"
                        className="w-full px-4 py-3.5 border border-[#0a0a0a]/15 rounded-lg text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="co-email" className="block text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/50 mb-2">
                        Email
                      </label>
                      <input
                        id="co-email"
                        name="email"
                        type="email"
                        required
                        placeholder="vous@email.com"
                        className="w-full px-4 py-3.5 border border-[#0a0a0a]/15 rounded-lg text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors"
                      />
                    </div>
                    <div className="mb-6">
                      <label htmlFor="co-address" className="block text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/50 mb-2">
                        Adresse de livraison
                      </label>
                      <textarea
                        id="co-address"
                        name="address"
                        required
                        rows={3}
                        placeholder="12 rue de la Paix, 75002 Paris, France"
                        className="w-full px-4 py-3.5 border border-[#0a0a0a]/15 rounded-lg text-sm text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] transition-colors resize-none"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-[#0a0a0a]/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/50">Total</span>
                      <span className="font-black text-[#0a0a0a] text-lg">{formatEUR(total)}</span>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full min-h-[44px] flex items-center justify-center gap-3 px-8 py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border-none ${loading ? "bg-[#0a0a0a]/50 cursor-not-allowed" : "bg-[#0a0a0a] hover:bg-[#333] cursor-pointer"}`}
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                          />
                          Traitement en cours…
                        </>
                      ) : (
                        "Confirmer la commande"
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div key="cart-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {cart.length === 0 ? (
                      <p className="text-sm text-[#0a0a0a]/40 text-center py-16">Votre panier est vide.</p>
                    ) : (
                      <>
                        <div className="space-y-5 mb-6">
                          {cart.map((item) => (
                            <div key={item.key} className="flex gap-4 items-center">
                              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#f5f5f5]">
                                <Image src={item.img} alt={item.name} fill className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-[#0a0a0a] text-xs uppercase tracking-tight truncate">{item.name}</p>
                                <p className="text-[10px] text-[#0a0a0a]/40 uppercase tracking-wide mt-0.5">{item.strap} · {item.size}</p>
                                <p className="text-xs font-bold text-[#0a0a0a] mt-1">{item.qty} × {formatEUR(item.price)}</p>
                              </div>
                              <button
                                onClick={() => onRemove(item.key)}
                                aria-label={`Retirer ${item.name} du panier`}
                                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors cursor-pointer border-none bg-transparent flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4 text-[#0a0a0a]/40" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between items-center py-5 border-t border-[#0a0a0a]/10 mb-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/50">Total</span>
                          <span className="font-black text-[#0a0a0a] text-lg">{formatEUR(total)}</span>
                        </div>
                        <button
                          onClick={onStartCheckout}
                          className="w-full min-h-[44px] px-8 py-4 bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#333] transition-all cursor-pointer border-none"
                        >
                          Passer la commande
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function OrbitAIPage() {
  const [session, setSession] = useState<{
    formData?: {
      businessName?: string; businessType?: string; tagline?: string;
      city?: string; mainService?: string; benefits?: string[];
      priceRange?: string; targetAudience?: string; brandColor?: string;
      email?: string; phone?: string; instagram?: string; linkedin?: string;
    };
    generatedContent?: {
      heroHeadline?: string; heroSubline?: string; aboutTitle?: string;
      aboutText?: string; ctaText?: string; metaTitle?: string;
      metaDescription?: string;
      services?: { title?: string; description?: string }[];
      testimonials?: { name?: string; role?: string; text?: string; rating?: number }[];
    };
  } | null>(null);

  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get("session");
    /* La navigation interne perd le paramètre : on retient la session par thème. */
    try {
      const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
      if (id) sessionStorage.setItem(cleSession, id);
      else id = sessionStorage.getItem(cleSession);
    } catch {}
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;




  sessionData = session;




  memoriserSession(sessionData);
  c = session?.generatedContent;
  BESTSELLERS_DEMO_SOURCE = BESTSELLERS_DEMO_SOURCE_LIVE();
  MATERIALS_DEMO_SOURCE = MATERIALS_DEMO_SOURCE_LIVE();
  PRODUCTS_SOURCE = PRODUCTS_SOURCE_LIVE();
  HERO_PRODUCTS_DEMO_SOURCE = HERO_PRODUCTS_DEMO_SOURCE_LIVE();

  HERO_PRODUCTS_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...HERO_PRODUCTS_DEMO_SOURCE[i % HERO_PRODUCTS_DEMO_SOURCE.length], name: s.title, desc: s.desc || "" || "", price: s.price ?? HERO_PRODUCTS_DEMO_SOURCE[i % HERO_PRODUCTS_DEMO_SOURCE.length].price })),
    HERO_PRODUCTS_DEMO_SOURCE,
  );
  PRODUCTS = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...PRODUCTS_SOURCE[i % PRODUCTS_SOURCE.length], name: s.title, price: s.price ?? PRODUCTS_SOURCE[i % PRODUCTS_SOURCE.length].price })),
    PRODUCTS_SOURCE,
  );
  MATERIALS_DEMO = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...MATERIALS_DEMO_SOURCE[i % MATERIALS_DEMO_SOURCE.length], name: s.title, desc: s.desc || "" || "" })),
    MATERIALS_DEMO_SOURCE,
  );
  BESTSELLERS_DEMO = resolveList(
    clientStats(session)?.map((s: any, i: number) => ({ ...BESTSELLERS_DEMO_SOURCE[i % BESTSELLERS_DEMO_SOURCE.length], val: s.value, label: s.label })),
    BESTSELLERS_DEMO_SOURCE,
  );
  GUARANTEES = resolveList(
    clientServices(session)?.map((s: any, i: number) => ({ ...GUARANTEES_SOURCE[i % GUARANTEES_SOURCE.length], title: s.title, desc: s.desc || "" || "" })),
    GUARANTEES_SOURCE,
  );

  FAQ_INLINE = resolveList(

    clientFaq(session)?.map((r: any, i: number) => ({

      ...FAQ_INLINE_SOURCE[i % FAQ_INLINE_SOURCE.length],

      q: r.q, a: r.a,

    })),

    FAQ_INLINE_SOURCE,

  );
  HERO_PRODUCTS = HERO_PRODUCTS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(session)[0 + i] || row.img,
  }));
  MATERIALS = MATERIALS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(session)[3 + i] || row.img,
  }));
  BESTSELLERS = BESTSELLERS_DEMO.map((row, i) => ({
    ...row,
    img: clientPhotos(session)[7 + i] || row.img,
  }));

  useEffect(() => {
    if (!fd?.photoUrls?.length) return;
    let n = 0;
    const _photoArrays: any[] = [HERO_PRODUCTS, PRODUCTS, MATERIALS, BESTSELLERS];
    _photoArrays.forEach((arr) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        if (!item || typeof item !== "object") return;
        for (const key of ["img", "src", "image", "imgSrc", "photo"]) {
          if (typeof item[key] === "string" && item[key].includes("images.unsplash.com")) {
            if (fd.photoUrls[n]) item[key] = fd.photoUrls[n];
            n++;
          }
        }
      });
    });
  });
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Cart / checkout flow
  const [selectedProduct, setSelectedProduct] = useState<SelectableProduct | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleAddToCart = (strap: string, size: string, qty: number) => {
    if (!selectedProduct) return;
    const item: CartItem = {
      key: `${selectedProduct.id}-${strap}-${size}`,
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: parsePriceToNumber(selectedProduct.price),
      qty,
      strap,
      size,
      img: selectedProduct.img,
    };
    setCart((prev) => {
      const existing = prev.find((p) => p.key === item.key);
      if (existing) {
        return prev.map((p) => (p.key === item.key ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, item];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (key: string) => {
    setCart((prev) => prev.filter((p) => p.key !== key));
  };

  const handleSubmitCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setTimeout(() => {
      setCheckoutLoading(false);
      setCheckoutStep("success");
    }, 2200);
  };

  const handleResetCart = () => {
    setCart([]);
    setCheckoutStep("cart");
    setCartOpen(false);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const prevHero = () => setHeroIdx((i) => (i - 1 + HERO_PRODUCTS.length) % HERO_PRODUCTS.length);
  const nextHero = () => setHeroIdx((i) => (i + 1) % HERO_PRODUCTS.length);
  const currentHero = HERO_PRODUCTS[heroIdx];

  
  // Dynamic Services & Testimonials Mutation for Session Data
  
return (
    <div className="relative w-full bg-[#ffffff]">
      {/* Floating cart trigger */}
      <button
        onClick={() => setCartOpen(true)}
        aria-label={`Ouvrir le panier (${cartCount} article${cartCount > 1 ? "s" : ""})`}
        className="fixed bottom-6 right-6 z-[290] w-14 h-14 flex items-center justify-center bg-[#0a0a0a] text-white rounded-full shadow-lg hover:bg-[#333] transition-all cursor-pointer border-none"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center bg-white text-[#0a0a0a] text-[10px] font-black rounded-full border border-[#0a0a0a]">
            {cartCount}
          </span>
        )}
      </button>

      <ProductVariantModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={handleAddToCart}
      />

      <CartDrawer
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
          if (checkoutStep !== "success") setCheckoutStep("cart");
        }}
        cart={cart}
        onRemove={handleRemoveFromCart}
        step={checkoutStep}
        onStartCheckout={() => setCheckoutStep("checkout")}
        loading={checkoutLoading}
        onSubmitCheckout={handleSubmitCheckout}
        onReset={handleResetCart}
      />

      {/* ── HERO ──────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-[#050810] pt-28 pb-16 md:pt-24"
      >
        <GridBackground />
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={currentHero.img}
            alt={currentHero.name}
            fill
            className="object-cover opacity-25 scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-[#050810]/50" />
        </motion.div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 w-full text-center lg:text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <Reveal delay={0.1} y={60}>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.1] uppercase mb-6 italic text-white">{clientHeroLine(sessionData, 0, 1, 28) ?? c?.heroHeadline ?? <>
                  {currentHero.name}
                </>}</h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-white/30 text-sm leading-relaxed mb-6 max-w-md font-light">{fd?.tagline ?? c?.heroSubline ?? <>
                  {currentHero.desc}
                </>}</p>
                <div className="inline-block px-3 py-1.5 border border-white/10 text-[10px] text-white/40 uppercase tracking-widest font-bold rounded mb-10">
                  {currentHero.badge}
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  <div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1 font-bold">Prix</div>
                    <div className="text-4xl font-black text-white tracking-tighter">{currentHero.price}</div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct({ id: currentHero.id, name: currentHero.name, price: currentHero.price, img: currentHero.img })}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#f0f0f0] transition-all cursor-pointer border-none rounded min-h-[44px]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Ajouter au panier
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Carousel nav */}
            <Reveal delay={0.4} y={0}>
              <div className="relative">
                <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10">
                  <Image
                    src={currentHero.img}
                    alt={currentHero.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded text-[10px] text-white font-bold uppercase tracking-widest border border-white/20">
                    3D Rotate
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={prevHero}
                    className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                    aria-label="Produit précédent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex gap-2">
                    {HERO_PRODUCTS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setHeroIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === heroIdx ? "bg-white" : "bg-white/20"}`}
                        aria-label={`Produit ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextHero}
                    className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                    aria-label="Produit suivant"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ==========================================
          2. PRODUCT GRID
          ========================================== */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0a0a0a]/30 mb-3">
                  Collection
                </p>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0a0a0a]">{/* TEXTE_SECTION */ clientText(sessionData, "section-2.titre") ?? (<>
                  Toutes les pièces
                </>)}</h2>
              </div>
              <Link href="/templates/impact-75/telemetry">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0a]/30 hover:text-[#0a0a0a] transition-colors cursor-pointer flex items-center gap-2 group">
                  Voir tout
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.07}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f5f5f5] mb-4">
                    <Image
                      src={product.img}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {product.isNew && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-widest rounded">
                        New
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/5 transition-colors duration-300" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setSelectedProduct({ id: product.id, name: product.name, price: product.price, img: product.img })}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-[#333] transition-all cursor-pointer border-none min-h-[44px]"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Panier
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] text-[#0a0a0a]/30 uppercase tracking-widest font-bold mb-1">
                        {product.category}
                      </p>
                      <p className="font-black text-[#0a0a0a] text-sm uppercase tracking-tight">
                        {product.name}
                      </p>
                    </div>
                    <p className="font-bold text-[#0a0a0a] text-sm">{product.price}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          3. MATERIALS & CRAFT
          ========================================== */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-4">
                Savoir-Faire
              </p>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">{/* TEXTE_SECTION */ clientText(sessionData, "section-3.titre") ?? (<>
                Matières d&apos;exception
              </>)}</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MATERIALS.map((mat, i) => (
              <Reveal key={mat.name} delay={i * 0.1}>
                <div className="group flex gap-6 p-8 bg-white/5 border border-white/5 rounded-lg hover:border-white/10 transition-all duration-300 cursor-default">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={mat.img}
                      alt={mat.name}
                      fill
                      className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/20 uppercase tracking-widest font-bold mb-1">
                      {mat.subtitle}
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white mb-3 italic">
                      {mat.name}
                    </h3>
                    <p className="text-xs text-white/40 leading-relaxed">
                      {mat.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          4. BESTSELLERS — DETAILED
          ========================================== */}
      <section className="py-24 bg-[#f8f8f8]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0a0a0a]/30 mb-3">
                Best-Sellers
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0a0a0a]">{/* TEXTE_SECTION */ clientText(sessionData, "section-4.titre") ?? (<>
                Les incontournables
              </>)}</h2>
            </div>
          </Reveal>

          <div className="space-y-8">
            {BESTSELLERS.map((item, i) => (
              <Reveal key={item.name} delay={i * 0.1}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white rounded-xl overflow-hidden border border-[#0a0a0a]/6 hover:shadow-md transition-shadow">
                  <div className="relative aspect-square md:aspect-auto md:h-72">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0a0a0a] mb-6 italic">
                        {item.name}
                      </h3>
                      <div className="space-y-3 mb-8">
                        {item.specs.map((spec) => (
                          <div key={spec.label} className="flex items-center justify-between py-2 border-b border-[#0a0a0a]/5">
                            <span className="text-[10px] text-[#0a0a0a]/30 uppercase tracking-widest font-bold">
                              {spec.label}
                            </span>
                            <span className="text-[10px] font-bold text-[#0a0a0a]">
                              {spec.val}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-[#0a0a0a] tracking-tighter">
                        {item.price}
                      </div>
                      <button
                        onClick={() => setSelectedProduct({ id: i + 100, name: item.name, price: item.price, img: item.img })}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#0a0a0a] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-[#333] transition-all cursor-pointer border-none min-h-[44px]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          5. SOCIAL PROOF — AS SEEN IN
          ========================================== */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-4">
                Presse & Médias
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white italic">{/* TEXTE_SECTION */ clientText(sessionData, "section-5.titre") ?? (<>
                Ils parlent de nous
              </>)}</h2>
            </div>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {PUBLICATIONS.map((pub, i) => (
              <Reveal key={pub} delay={i * 0.06}>
                <div className="px-8 py-4 border border-white/10 rounded text-white/20 text-sm font-black uppercase tracking-widest hover:text-white/60 hover:border-white/30 transition-all duration-300 cursor-default">
                  {pub}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-12 border-t border-white/5">
              <div className="text-center">
                <div className="text-5xl font-black text-white tracking-tighter mb-2">4.9</div>
                <div className="flex justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                  Note moyenne
                </div>
              </div>
              <div className="w-px h-16 bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="text-5xl font-black text-white tracking-tighter mb-2">1 240</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-2">
                  Avis vérifiés
                </div>
              </div>
              <div className="w-px h-16 bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="text-5xl font-black text-white tracking-tighter mb-2">98%</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-2">
                  Clients satisfaits
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ==========================================
          6. GUARANTEE — 4 PILLARS
          ========================================== */}
      <section className="py-24 bg-[#ffffff]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#0a0a0a]/30 mb-4">
                Notre Engagement
              </p>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0a0a0a] italic">{/* TEXTE_SECTION */ clientText(sessionData, "section-6.titre") ?? (<>
                L&apos;excellence, <br />
                <span className="text-[#0a0a0a]/20">sans compromis.</span>
              </>)}</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GUARANTEES.map((g, i) => (
              <Reveal key={g.title} delay={i * 0.1}>
                <div className="flex flex-col items-start p-8 border border-[#0a0a0a]/8 rounded-xl hover:border-[#0a0a0a]/20 hover:shadow-md transition-all duration-300">
                  <div className="w-12 h-12 bg-[#0a0a0a] rounded flex items-center justify-center text-white mb-6">
                    {g.icon}
                  </div>
                  <h3 className="font-black uppercase tracking-tight text-[#0a0a0a] text-sm mb-3">
                    {g.title}
                  </h3>
                  <p className="text-xs text-[#0a0a0a]/50 leading-relaxed">{g.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          7. REVIEWS
          ========================================== */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-4">Avis vérifiés</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{/* TEXTE_SECTION */ clientText(sessionData, "section-7.titre") ?? (<>
                  Ce qu'ils disent.<br /><span className="text-white/20">Sans filtre.</span>
                </>)}</h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-5xl font-black text-white">4.9</div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-white rounded-sm" />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-wide">2 840 avis · Trustpilot</p>
                </div>
              </div>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Thomas R.", product: "Orion X Pro — 4K Monitor", date: "Il y a 3 jours", stars: 5, review: "Moniteur absolument exceptionnel. Après 3 semaines d'utilisation intensive pour la production vidéo, je ne reviendrai jamais en arrière. Les couleurs sont d'une précision chirurgicale, la latence est imperceptible. Le packaging était également d'une qualité remarquable." },
              { name: "Léa M.", product: "NeuronPad Ultra — Tablette", date: "Il y a 1 semaine", stars: 5, review: "J'hésitais longtemps à me lancer mais l'achat sur le site a été fluide, la livraison en 48h chrono, et le produit dépasse toutes mes attentes. La batterie tient facilement une journée de travail. Support client réactif sur le SAV aussi." },
              { name: "Karim B.", product: "ChromaHub Pro — Station USB", date: "Il y a 2 semaines", stars: 5, review: "Le hub USB qui a transformé mon setup. 12 ports, aucun problème de compatibilité, charge mon laptop à 100W sans broncher. Petit mais costaud. J'en ai commandé un deuxième pour le bureau." },
              { name: "Sarah D.", product: "CoreBlade — SSD 4To", date: "Il y a 3 semaines", stars: 5, review: "7200 MB/s en lecture, comme annoncé. Mes temps de boot sont passés de 28 secondes à 6 secondes. Pour un usage pro sur DaVinci Resolve, c'est un game-changer. Livré avec un kit de vis et un dissipateur thermique — petits détails qui font la différence." },
              { name: "Julie F.", product: "ArcSound Pro — Casque", date: "Il y a 1 mois", stars: 5, review: "Abandonnée par mon ancien casque de 400€, j'ai sauté sur l'ArcSound Pro sur recommandation. Spatialisation 3D bluffante pour le gaming, noise-cancelling qui tient ses promesses, autonomie de 45h. Rapport qualité-prix imbattable." },
              { name: "Marc A.", product: "ZeroDesk — Bureau motorisé", date: "Il y a 1 mois", stars: 5, review: "Installation en 20 minutes, mémoire à 4 positions, motorisation silencieuse même à 3h du matin. La stabilité est parfaite même avec 3 écrans et un setup complet. Commande un dimanche soir, livraison le mardi matin. Service impeccable." },
            ].map((r, i) => (
              <Reveal key={r.name} delay={i * 0.08}>
                <div className="bg-white/3 border border-white/5 p-6 hover:border-white/10 transition-all">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(r.stars)].map((_, s) => (
                      <div key={s} className="w-3 h-3 bg-white rounded-sm flex-shrink-0" />
                    ))}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed mb-6 italic">"{r.review}"</p>
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">{r.name}</p>
                    <p className="text-[10px] text-white/20 uppercase tracking-wide">{r.product} · {r.date}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          8. FAQ
          ========================================== */}
      <section className="py-24 bg-white">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 mb-4">Questions fréquentes</p>
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-16">{/* TEXTE_SECTION */ clientText(sessionData, "section-8.titre") ?? (<>FAQ</>)}</h2>
          </Reveal>
          <div className="divide-y divide-black/5">
            {FAQ_INLINE.map((faq, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="py-8">
                  <h4 className="font-black text-black text-sm uppercase tracking-wide mb-4">{faq.q}</h4>
                  <p className="text-sm text-black/40 leading-relaxed">{faq.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          9. NEWSLETTER — MINIMAL SIGNUP
          ========================================== */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 mb-8">
              Collection Privée
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white italic mb-4">{c?.aboutTitle ?? fd?.businessName ?? <>
              Soyez le premier informé.
            </>}</h2>
            <p className="text-white/30 text-sm leading-relaxed mb-10">{c?.aboutText ?? <>
              Accès en avant-première aux nouvelles collections, éditions limitées
              et événements privés.
            </>}</p>

            {subscribed ? (
              <div className="flex items-center justify-center gap-3 px-8 py-4 border border-white/10 rounded text-white/60 text-sm font-bold uppercase tracking-widest">
                <Check className="w-4 h-4 text-white/40" />
                Merci, nous vous répondrons sous 24h.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubscribed(true);
                }}
                className="flex gap-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-4 bg-white text-[#0a0a0a] text-[10px] font-black uppercase tracking-widest rounded hover:bg-[#f0f0f0] transition-all cursor-pointer border-none whitespace-nowrap"
                >
                  S&apos;abonner
                </button>
              </form>
            )}

            <p className="mt-5 text-[10px] text-white/15 uppercase tracking-widest">
              Données confidentielles · Désabonnement en un clic
            </p>
          </Reveal>
        </div>
      </section>
      {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}
      <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.9, textShadow: "0 0 2px rgba(0,0,0,0.55), 0 0 10px rgba(255,255,255,0.35)" }}>
        {clientName({ formData: fd }) ?? "impact-75"}
        {clientCity({ formData: fd }) ? ` · ${clientCity({ formData: fd })}` : ""}
      </footer>
    </div>
  );
}
