"use client";
// @ts-nocheck

import { motion, useScroll, useTransform } from "framer-motion";
import {useRef, useState, useEffect} from 'react';
import Image from "next/image";
import Link from "next/link";
import {
  Radio,
  Terminal,
  Star,
  Shield,
  RotateCcw,
  Award,
  Truck,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
} from "lucide-react";
import { Reveal, GridBackground } from "./shared";

/* ============================================================
   DATA
   ============================================================ */

const HERO_PRODUCTS = [
  {
    id: 1,
    name: "Helix Noir",
    collection: "Monochrome Series",
    price: "€8 400",
    desc: "Boîtier grade 5 titane poli miroir. Mouvement mécanique automatique 72h de réserve. Verre saphir anti-reflets.",
    badge: "Édition Limitée — 150 pièces",
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
    accent: "#0a0a0a",
  },
  {
    id: 2,
    name: "Aurora S",
    collection: "Aurora Dial Series",
    price: "€12 900",
    desc: "Cadran en nacre rose naturelle. Complications : date, phases de lune. Bracelet alligator bordeaux cousu main.",
    badge: "New Season",
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1200&auto=format&fit=crop",
    accent: "#8B0000",
  },
  {
    id: 3,
    name: "Meridian GMT",
    collection: "Exploration Series",
    price: "€15 600",
    desc: "Fonction GMT double fuseau. Céramique haute pression noire absolue. Étanchéité 300m. Certifié COSC.",
    badge: "Best-Seller",
    img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1200&auto=format&fit=crop",
    accent: "#1a3a5c",
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: "Helix Noir",
    price: "€8 400",
    isNew: false,
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
    category: "Monochrome",
  },
  {
    id: 2,
    name: "Aurora S",
    price: "€12 900",
    isNew: true,
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800&auto=format&fit=crop",
    category: "Cadrans",
  },
  {
    id: 3,
    name: "Meridian GMT",
    price: "€15 600",
    isNew: false,
    img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop",
    category: "Exploration",
  },
  {
    id: 4,
    name: "Solstice Blanc",
    price: "€6 200",
    isNew: true,
    img: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=800&auto=format&fit=crop",
    category: "Classique",
  },
  {
    id: 5,
    name: "Vertex Chronograph",
    price: "€19 800",
    isNew: false,
    img: "https://images.unsplash.com/photo-1461141346587-763ab02bced9?q=80&w=800&auto=format&fit=crop",
    category: "Chronographe",
  },
  {
    id: 6,
    name: "Onyx Perpetual",
    price: "€24 500",
    isNew: false,
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
    category: "Grande Complication",
  },
];

const MATERIALS = [
  {
    name: "Swiss Movement",
    subtitle: "ETA 2824-2 / In-house",
    desc: "Chaque calibre est assemblé à la main par nos maîtres horlogers à Genève. Réglage chronomètre, 6 positions. Réserve de marche minimum 48h.",
    img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Sapphire Crystal",
    subtitle: "Grade 9 · Anti-reflective",
    desc: "Verre saphir synthétique de grade 9, traitement anti-reflets double face. Dureté Mohs 9/10 — résistant aux rayures du quotidien.",
    img: "https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Grade 5 Titanium",
    subtitle: "Ti6Al4V · DLC Coated",
    desc: "Alliage aérospatial grade 5 (Ti-6Al-4V), 40% plus léger que l'acier, 3× plus résistant. Revêtement DLC noir 5 microns en option.",
    img: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Alligator Strap",
    subtitle: "Mississippi · Cousu main",
    desc: "Cuir alligator du Mississippi tannage végétal, cousu main double fil de soie, doublure veau nappa. Boucle déployante en titane massif.",
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
  },
];

const BESTSELLERS = [
  {
    name: "Meridian GMT",
    price: "€15 600",
    img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop",
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
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800&auto=format&fit=crop",
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
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
    specs: [
      { label: "Mouvement", val: "Calendrier Perpétuel maison" },
      { label: "Complications", val: "Quantième perpétuel, Chrono" },
      { label: "Boîtier", val: "Céramique noire, 44mm" },
      { label: "Verre", val: "Saphir bombé, AR 4 couches" },
      { label: "Réserve de marche", val: "90 heures" },
    ],
  },
];

const PUBLICATIONS = [
  "Le Monde",
  "Vogue France",
  "Forbes",
  "The Telegraph",
  "Hodinkee",
  "GQ France",
];

const GUARANTEES = [
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


// Global state variables for subpage compatibility
let fd: any = null;
let c: any = null;
let brand: any = null;
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
    const id = new URLSearchParams(window.location.search).get("session");
    if (!id) return;
    fetch(`/api/sessions?id=${id}`)
      .then((r) => r.json())
      .then(setSession)
      .catch(() => {});
  }, []);

  fd = session?.formData;
  c = session?.generatedContent;
  brand = fd?.brandColor ?? null; // null = keep template's original color

  const heroRef = useRef(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

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
  useEffect(() => {
    if (c?.services) {
      const services_arrays = [
        typeof SERVICES !== 'undefined' ? SERVICES : null,
        typeof features !== 'undefined' ? features : null,
        typeof services !== 'undefined' ? services : null,
        typeof FEATURES !== 'undefined' ? FEATURES : null,
      ];
      services_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((s, idx) => {
            if (idx < 3 && c.services[idx]) {
              if (s && typeof s === 'object') {
                s.title = c.services[idx].title ?? s.title;
                if ('desc' in s) s.desc = c.services[idx].description ?? s.desc;
                if ('description' in s) s.description = c.services[idx].description ?? s.description;
              }
            }
          });
        }
      });
    }
    if (c?.testimonials) {
      const testimonials_arrays = [
        typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : null,
        typeof testimonials !== 'undefined' ? testimonials : null,
        typeof REVIEWS !== 'undefined' ? REVIEWS : null,
        typeof reviews !== 'undefined' ? reviews : null,
      ];
      testimonials_arrays.forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach((t, idx) => {
            if (idx < 3 && c.testimonials[idx]) {
              if (t && typeof t === 'object') {
                t.name = c.testimonials[idx].name ?? t.name;
                if ('role' in t) t.role = c.testimonials[idx].role ?? t.role;
                if ('text' in t) t.text = c.testimonials[idx].text ?? t.text;
                if ('quote' in t) t.quote = c.testimonials[idx].text ?? t.quote;
                if ('desc' in t) t.desc = c.testimonials[idx].text ?? t.desc;
              }
            }
          });
        }
      });
    }
  }, [c]);
return (
    <div className="relative w-full bg-[#ffffff]">
      {/* ── HERO ──────────────────── */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050810]"
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
              <Reveal>
                <div className="inline-flex items-center gap-4 mb-10 text-cyan-500 text-[10px] font-bold uppercase tracking-[0.5em] italic">
                  <Terminal className="w-4 h-4" /> {currentHero.collection}
                </div>
              </Reveal>
              <Reveal delay={0.1} y={60}>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] uppercase mb-6 italic text-white">{c?.heroHeadline ?? <>
                  {currentHero.name}
                </>}</h1>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-white/30 text-sm leading-relaxed mb-6 max-w-md font-light">{c?.heroSubline ?? fd?.tagline ?? <>
                  {currentHero.desc}
                </>}</p>
                <div className="inline-block px-3 py-1.5 border border-white/10 text-[9px] text-white/40 uppercase tracking-widest font-bold rounded mb-10">
                  {currentHero.badge}
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                  <div>
                    <div className="text-[9px] text-white/20 uppercase tracking-widest mb-1 font-bold">Prix</div>
                    <div className="text-4xl font-black text-white tracking-tighter">{currentHero.price}</div>
                  </div>
                  <button
                    onClick={() => setAddedToCart(currentHero.id)}
                    className="flex items-center gap-3 px-8 py-4 bg-white text-black text-[9px] font-black uppercase tracking-widest hover:bg-[#f0f0f0] transition-all cursor-pointer border-none rounded"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {addedToCart === currentHero.id ? "Ajouté ✓" : "Ajouter au panier"}
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
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded text-[9px] text-white font-bold uppercase tracking-widest border border-white/20">
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
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0a0a0a]">
                  Toutes les pièces
                </h2>
              </div>
              <Link href="/templates/impact-75/telemetry">
                <button className="text-[9px] font-black uppercase tracking-widest text-[#0a0a0a]/30 hover:text-[#0a0a0a] transition-colors cursor-pointer flex items-center gap-2 group">
                  Voir tout
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
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
                      <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#0a0a0a] text-white text-[8px] font-black uppercase tracking-widest rounded">
                        New
                      </div>
                    )}
                    <div className="absolute inset-0 bg-[#0a0a0a]/0 group-hover:bg-[#0a0a0a]/5 transition-colors duration-300" />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => setAddedToCart(product.id)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0a] text-white text-[9px] font-black uppercase tracking-widest rounded hover:bg-[#333] transition-all cursor-pointer border-none"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        {addedToCart === product.id ? "Ajouté ✓" : "Panier"}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[9px] text-[#0a0a0a]/30 uppercase tracking-widest font-bold mb-1">
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
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                Matières d&apos;exception
              </h2>
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
                    <div className="text-[9px] text-white/20 uppercase tracking-widest font-bold mb-1">
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
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0a0a0a]">
                Les incontournables
              </h2>
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
                            <span className="text-[9px] text-[#0a0a0a]/30 uppercase tracking-widest font-bold">
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
                        onClick={() => setAddedToCart(i + 100)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-[#0a0a0a] text-white text-[9px] font-black uppercase tracking-widest rounded hover:bg-[#333] transition-all cursor-pointer border-none"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        {addedToCart === i + 100 ? "Ajouté ✓" : "Ajouter au panier"}
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
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white italic">
                Ils parlent de nous
              </h2>
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
                <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">
                  Note moyenne
                </div>
              </div>
              <div className="w-px h-16 bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="text-5xl font-black text-white tracking-tighter mb-2">1 240</div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-2">
                  Avis vérifiés
                </div>
              </div>
              <div className="w-px h-16 bg-white/10 hidden md:block" />
              <div className="text-center">
                <div className="text-5xl font-black text-white tracking-tighter mb-2">98%</div>
                <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold mt-2">
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
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#0a0a0a] italic">
                L&apos;excellence, <br />
                <span className="text-[#0a0a0a]/20">sans compromis.</span>
              </h2>
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
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Ce qu'ils disent.<br /><span className="text-white/20">Sans filtre.</span>
                </h2>
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
                    <p className="text-[9px] text-white/20 uppercase tracking-wide">{r.product} · {r.date}</p>
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
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-16">FAQ</h2>
          </Reveal>
          <div className="divide-y divide-black/5">
            {[
              { q: "Quels sont les délais de livraison ?", a: "Livraison standard : 2-3 jours ouvrés gratuite dès 200€. Express 24h disponible pour 12€ en France métropolitaine. Les produits en stock partent le jour même si la commande est passée avant 14h. Livraison internationale disponible dans 38 pays." },
              { q: "Quelle est votre politique de retour ?", a: "30 jours de retour gratuit, sans questions. Si votre produit présente un défaut ou ne vous convient pas, nous prenons en charge l'enlèvement à domicile et le remboursement intégral sous 5 jours ouvrés. Aucun frais de restockage." },
              { q: "Vos produits sont-ils garantis ?", a: "Tous nos produits bénéficient d'une garantie constructeur de 2 ans minimum, extensible à 5 ans avec notre programme NeuroSafe. En cas de panne, nous vous remplaçons le produit sous 48h sans attendre la fin du diagnostic." },
              { q: "Proposez-vous des facilités de paiement ?", a: "Oui — paiement en 3x ou 12x sans frais disponible dès 150€ via notre partenaire Alma. Paiement en 24x pour les produits à partir de 1 000€. Aucun justificatif ni formulaire papier — tout se fait en 30 secondes à la caisse." },
              { q: "Comment contacter le support ?", a: "Chat en direct disponible 7j/7 de 8h à 23h. Email avec réponse garantie en moins de 2h en semaine, 4h le week-end. Pour les produits sous garantie, ligne prioritaire au 01 88 32 XX XX. Notre NPS client est de 78 — on ne dit pas ça pour rien." },
            ].map((faq, i) => (
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
                  className="px-6 py-4 bg-white text-[#0a0a0a] text-[9px] font-black uppercase tracking-widest rounded hover:bg-[#f0f0f0] transition-all cursor-pointer border-none whitespace-nowrap"
                >
                  S&apos;abonner
                </button>
              </form>
            )}

            <p className="mt-5 text-[9px] text-white/15 uppercase tracking-widest">
              Données confidentielles · Désabonnement en un clic
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
