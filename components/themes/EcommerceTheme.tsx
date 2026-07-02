"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { SessionData } from "@/lib/sessions";
import { ThemeWrapper } from "./ThemeWrapper";
import { Reveal, Stagger, StaggerItem } from "./AnimationHelpers";
import { ShoppingBag, X, Plus, Minus, Star, ShieldCheck, Truck, RotateCcw, ArrowRight, ArrowLeft, Mail, MapPin, Phone, Clock, Globe, HelpCircle, Gift, Award, Zap, Calendar } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Page model — client-side page switching (no Next routes)
// ─────────────────────────────────────────────────────────────────────────────
type Page = "home" | "shop" | "blog" | "about" | "contact" | "cgv" | "mentions";

// --- Mock Product Data Generator ---
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  description: string;
};

const generateProducts = (businessType: string, brandColor: string): Product[] => {
  const base = [
    { id: 1, name: "Premium Collection Item", price: 129, category: "Featured", desc: "Une pièce maîtresse de notre collection, façonnée dans des matériaux nobles et pensée pour durer. Le détail qui fait toute la différence." },
    { id: 2, name: "Limited Edition Release", price: 89, category: "New Arrivals", desc: "Édition limitée, produite en série restreinte. Un design contemporain pour celles et ceux qui recherchent l'exclusivité." },
    { id: 3, name: "Signature Series A", price: 199, category: "Bestsellers", desc: "Notre best-seller absolu. Plébiscité par notre communauté, il allie élégance intemporelle et confort au quotidien." },
    { id: 4, name: "Essential Pack", price: 45, category: "Featured", desc: "L'essentiel, sans compromis. Un indispensable accessible qui trouve naturellement sa place dans votre quotidien." },
    { id: 5, name: "Modern Classic", price: 155, category: "New Arrivals", desc: "Le classique revisité. Des lignes épurées et une finition irréprochable pour un style affirmé en toutes circonstances." },
    { id: 6, name: "Artisanal Selection", price: 210, category: "Bestsellers", desc: "Fabriqué à la main par nos artisans. Chaque exemplaire est unique et porte la marque d'un savoir-faire d'exception." },
  ];

  return base.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    description: p.desc,
    image: `https://images.unsplash.com/photo-${1500000000000 + p.id * 1000}?w=800&q=80`,
    rating: Number((4.5 + (p.id % 5) * 0.1).toFixed(1)),
  }));
};

// --- Mock Blog Data (FR) ---
type Article = {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  body: string[];
};

const ARTICLES: Article[] = [
  {
    id: 1,
    title: "Les tendances incontournables de la saison 2026",
    date: "12 mars 2026",
    excerpt: "Découvrez les pièces qui définiront l'année. Entre retour des classiques et audaces contemporaines, notre sélection éclairée.",
    cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    body: [
      "Chaque nouvelle saison apporte son lot de surprises, et 2026 ne fait pas exception. Cette année, nous assistons à un retour marqué vers des matières nobles et durables, plébiscitées par une clientèle de plus en plus attentive à l'origine de ses achats.",
      "Les coupes se font plus structurées, les couleurs plus profondes. On retrouve une palette inspirée des tons minéraux, ponctuée d'éclats de couleurs vives qui apportent du caractère à chaque tenue.",
      "Notre conseil : misez sur des pièces intemporelles que vous pourrez porter saison après saison, tout en vous offrant une ou deux nouveautés audacieuses pour affirmer votre personnalité.",
    ],
  },
  {
    id: 2,
    title: "Comment entretenir vos pièces pour qu'elles durent",
    date: "28 février 2026",
    excerpt: "Un bon entretien prolonge considérablement la vie de vos produits. Nos gestes simples et efficaces à adopter au quotidien.",
    cover: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=80",
    body: [
      "Investir dans des produits de qualité, c'est aussi savoir en prendre soin. Quelques gestes simples suffisent pour préserver l'éclat et la longévité de vos pièces favorites.",
      "Privilégiez toujours un lavage à basse température et évitez le sèche-linge lorsque cela est possible. Le rangement compte tout autant : préférez des espaces aérés, à l'abri de la lumière directe.",
      "En adoptant ces réflexes, vous prolongez la durée de vie de vos achats tout en réduisant votre impact environnemental. Un cercle vertueux qui profite à tous.",
    ],
  },
  {
    id: 3,
    title: "Dans les coulisses de notre atelier",
    date: "15 février 2026",
    excerpt: "Rencontre avec les artisans qui donnent vie à nos collections. Plongée au cœur d'un savoir-faire transmis avec passion.",
    cover: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80",
    body: [
      "Derrière chaque produit se cache une histoire, celle de femmes et d'hommes passionnés qui mettent leur talent au service de l'excellence. Nous avons poussé les portes de notre atelier pour vous.",
      "Ici, chaque étape est réalisée avec soin et précision. Du choix des matières premières à la finition finale, rien n'est laissé au hasard. C'est cette exigence qui fait la singularité de nos créations.",
      "Soutenir notre marque, c'est soutenir un artisanat local et responsable. Une démarche dont nous sommes fiers et que nous continuerons de défendre.",
    ],
  },
  {
    id: 4,
    title: "Notre engagement pour une mode responsable",
    date: "02 février 2026",
    excerpt: "La durabilité au cœur de notre démarche. Découvrez les initiatives concrètes que nous mettons en place jour après jour.",
    cover: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&q=80",
    body: [
      "La mode responsable n'est pas une tendance pour nous, c'est une conviction profonde. Nous croyons qu'il est possible de conjuguer style, qualité et respect de l'environnement.",
      "C'est pourquoi nous sélectionnons avec rigueur des matières durables, nous travaillons avec des fournisseurs partageant nos valeurs et nous limitons au maximum nos déchets de production.",
      "Chaque achat est un geste. En choisissant nos collections, vous participez à un mouvement vers une consommation plus consciente et plus juste.",
    ],
  },
];

// --- Tilt card (used in product grids) ---
function TiltCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]));

  function handleMouse(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main theme
// ─────────────────────────────────────────────────────────────────────────────
export function EcommerceTheme({ session }: { session: SessionData }) {
  const { formData, generatedContent: c } = session;
  const brand = formData.brandColor || "#7c3aed";
  const products = generateProducts(formData.businessType, brand);

  // Page + cart state (cart persists across page switches because it lives here)
  const [page, setPage] = useState<Page>("home");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const [cart, setCart] = useState<{ id: number; name: string; price: number; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState("All");

  const addToCart = (p: { id: number; name: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === p.id);
      if (existing) return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  // Navigate to a top-level page, resetting any drill-down detail views and
  // scrolling back to the top so each "page" feels like a real navigation.
  const goTo = (p: Page) => {
    setPage(p);
    setActiveProduct(null);
    setActiveArticle(null);
    setIsCartOpen(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const NAV_ITEMS: { key: Page; label: string }[] = [
    { key: "home", label: "Accueil" },
    { key: "shop", label: "Boutique" },
    { key: "blog", label: "Blog" },
    { key: "about", label: "À propos" },
    { key: "contact", label: "Contact" },
    { key: "cgv", label: "CGV" },
    { key: "mentions", label: "Mentions légales" },
  ];

  // Theme nav links injected into the shared ThemeWrapper nav slot ------------
  const navSlot = (
    <div className="hidden lg:flex items-center gap-7">
      {NAV_ITEMS.map(item => {
        const active = page === item.key;
        return (
          <button
            key={item.key}
            onClick={() => goTo(item.key)}
            className="relative text-xs font-bold uppercase tracking-widest transition-colors"
            style={{ color: active ? brand : undefined }}
          >
            <span className={active ? "" : "text-zinc-500 hover:text-zinc-900 transition-colors"}>{item.label}</span>
            {active && <span className="absolute -bottom-1.5 left-0 right-0 h-0.5" style={{ background: brand }} />}
          </button>
        );
      })}
    </div>
  );

  const navActions = (
    <button
      onClick={() => setIsCartOpen(true)}
      aria-label="Ouvrir le panier"
      className="relative w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 hover:border-zinc-900 transition-colors"
    >
      <ShoppingBag className="w-5 h-5" />
      {cartCount > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-white text-[10px] font-black"
          style={{ background: brand }}
        >
          {cartCount}
        </span>
      )}
    </button>
  );

  const footerSlot = (
    <div className="flex flex-col gap-3 text-xs uppercase tracking-widest">
      <button onClick={() => goTo("shop")} className="text-left hover:opacity-70 transition-opacity">Boutique</button>
      <button onClick={() => goTo("blog")} className="text-left hover:opacity-70 transition-opacity">Blog</button>
      <button onClick={() => goTo("about")} className="text-left hover:opacity-70 transition-opacity">À propos</button>
      <button onClick={() => goTo("contact")} className="text-left hover:opacity-70 transition-opacity">Contact</button>
      <button onClick={() => goTo("cgv")} className="text-left hover:opacity-70 transition-opacity">CGV</button>
      <button onClick={() => goTo("mentions")} className="text-left hover:opacity-70 transition-opacity">Mentions légales</button>
    </div>
  );

  // Mobile page tabs (since nav links are hidden on small screens) ------------
  const mobileTabs = (
    <div className="lg:hidden sticky top-16 z-[90] bg-white/90 backdrop-blur-md border-b border-zinc-100 overflow-x-auto">
      <div className="flex gap-1 px-4 py-2 min-w-max">
        {NAV_ITEMS.map(item => {
          const active = page === item.key;
          return (
            <button
              key={item.key}
              onClick={() => goTo(item.key)}
              className="px-4 py-2 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-all"
              style={active ? { background: "#18181b", color: "#fff" } : { color: "#a1a1aa" }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <ThemeWrapper
      session={session}
      navSlot={navSlot}
      navActions={navActions}
      footerSlot={footerSlot}
      onCtaClick={() => goTo("contact")}
    >
      {mobileTabs}

      <AnimatePresence mode="wait">
        <motion.div
          key={page + (activeProduct ? `-p${activeProduct.id}` : "") + (activeArticle ? `-a${activeArticle.id}` : "")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {page === "home" && (
            <HomePage formData={formData} c={c} brand={brand} products={products} filter={filter} setFilter={setFilter} addToCart={addToCart} goTo={goTo} />
          )}

          {page === "shop" && !activeProduct && (
            <ShopPage products={products} brand={brand} businessName={formData.businessName} filter={filter} setFilter={setFilter} addToCart={addToCart} onSelect={(p) => { setActiveProduct(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          )}
          {page === "shop" && activeProduct && (
            <ProductDetail product={activeProduct} brand={brand} addToCart={addToCart} onBack={() => { setActiveProduct(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} relatedProducts={products.filter(p => p.id !== activeProduct.id).slice(0, 3)} onSelect={(p) => { setActiveProduct(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          )}

          {page === "blog" && !activeArticle && (
            <BlogIndex brand={brand} onSelect={(a) => { setActiveArticle(a); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          )}
          {page === "blog" && activeArticle && (
            <BlogArticle article={activeArticle} brand={brand} onBack={() => { setActiveArticle(null); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          )}

          {page === "about" && <AboutPage formData={formData} c={c} brand={brand} goTo={goTo} />}
          {page === "contact" && <ContactPage formData={formData} brand={brand} />}

          {page === "cgv" && <CgvPage brand={brand} businessName={formData.businessName} />}
          {page === "mentions" && <MentionsPage brand={brand} />}
        </motion.div>
      </AnimatePresence>

      {/* Cart Drawer — shared across all pages */}
      <CartDrawer cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} brand={brand} />
    </ThemeWrapper>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE (original one-pager content, unchanged in spirit)
// ─────────────────────────────────────────────────────────────────────────────
function HomePage({
  formData, c, brand, products, filter, setFilter, addToCart, goTo,
}: {
  formData: SessionData["formData"];
  c: SessionData["generatedContent"];
  brand: string;
  products: Product[];
  filter: string;
  setFilter: (s: string) => void;
  addToCart: (p: Product) => void;
  goTo: (p: Page) => void;
}) {
  const filteredProducts = filter === "All" ? products : products.filter(p => p.category === filter);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-zinc-900">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5 }}
          src={formData.heroImageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-white">
          <Reveal>
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
              New Collection 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight max-w-3xl">
              {c?.heroHeadline}
            </h1>
            <p className="text-xl text-white/70 max-w-xl mb-12 leading-relaxed">
              {c?.heroSubline}
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => goTo("shop")}
                style={{ background: brand }}
                className="px-10 py-5 rounded-none font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all"
              >
                Shop Now
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-b bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 text-zinc-400">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"><Truck className="w-5 h-5 text-zinc-900" /> Free Shipping</div>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"><ShieldCheck className="w-5 h-5 text-zinc-900" /> Secure Payment</div>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest"><RotateCcw className="w-5 h-5 text-zinc-900" /> 30-Day Returns</div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <Reveal>
              <h2 className="text-5xl font-black uppercase tracking-tighter">Explore {formData.businessName}</h2>
              <div className="w-20 h-2 mt-6" style={{ background: brand }} />
            </Reveal>

            <div className="flex flex-wrap gap-4">
              {["All", "Featured", "New Arrivals", "Bestsellers"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${filter === cat ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-400 hover:text-zinc-900 border'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {filteredProducts.map(p => (
              <StaggerItem key={p.id}>
                <ProductCard p={p} brand={brand} addToCart={addToCart} onSelect={() => goTo("shop")} />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="text-center mt-16">
            <button
              onClick={() => goTo("shop")}
              className="inline-flex items-center gap-3 px-10 py-5 border-2 border-zinc-900 font-bold uppercase tracking-widest text-sm hover:bg-zinc-900 hover:text-white transition-all"
            >
              Voir toute la boutique <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Lookbook / Collections */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <Reveal>
              <h3 className="text-4xl font-black mb-8 uppercase tracking-tighter leading-tight">Curated with Passion,<br />Delivered with Precision.</h3>
              <p className="text-lg text-zinc-500 mb-12 leading-relaxed">
                {c?.aboutText}
              </p>
              <div className="grid grid-cols-2 gap-8">
                {formData.benefits.map((b, i) => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: brand }}>{i + 1}</div>
                    <div className="font-bold uppercase text-xs tracking-widest">{b}</div>
                  </div>
                ))}
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-6 h-[600px]">
              <div className="h-full pt-12"><img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" className="w-full h-full object-cover" /></div>
              <div className="h-full pb-12"><img src="https://images.unsplash.com/photo-1529139513055-119712d289b5?w=800&q=80" className="w-full h-full object-cover" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="text-center mb-20">
            <div className="text-xs font-black uppercase tracking-[0.3em] mb-6" style={{ color: brand }}>Customer Love</div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">What Our Customers Say</h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(c?.testimonials || [
              { name: "Sophie L.", role: "Verified Buyer", text: "Incredible quality. The packaging was beautiful and delivery was lightning fast.", rating: 5 },
              { name: "Marc T.", role: "Loyal Customer", text: "I've ordered multiple times — consistency is flawless. My go-to store.", rating: 5 },
              { name: "Emma R.", role: "First Purchase", text: "Exceeded expectations! The product quality is outstanding for the price.", rating: 5 },
            ]).map((t, i) => (
              <StaggerItem key={i}>
                <div className="p-8 bg-white border hover:shadow-xl transition-all h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed mb-8 flex-1 text-zinc-600 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: brand }}>{t.name.charAt(0)}</div>
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Shop By Category</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "New Arrivals", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" },
              { name: "Bestsellers", img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80" },
              { name: "Sale", img: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80" },
            ].map((cat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <button onClick={() => goTo("shop")} className="group relative aspect-[4/5] overflow-hidden cursor-pointer block w-full text-left">
                  <img src={cat.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{cat.name}</h3>
                    <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform" />
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="py-32 bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <Mail className="w-8 h-8 mx-auto mb-8 opacity-40" />
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">Join The Club</h2>
            <p className="text-lg text-white/50 mb-12 max-w-xl mx-auto">Get early access to new arrivals, exclusive deals, and 10% off your first order.</p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input type="email" placeholder="Your email address" className="flex-1 px-6 py-5 bg-white/10 border border-white/20 text-white placeholder:text-white/30 outline-none text-base" />
              <button type="submit" style={{ background: brand }} className="px-10 py-5 font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all">
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* CONTACT / STORE INFO */}
      <section id="contact" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Reveal>
              <div className="p-8 bg-zinc-50 border h-full">
                <MapPin className="w-6 h-6 mb-6" style={{ color: brand }} />
                <h3 className="font-black uppercase tracking-widest text-sm mb-4">Visit Us</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{formData.city}</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="p-8 bg-zinc-50 border h-full">
                <Mail className="w-6 h-6 mb-6" style={{ color: brand }} />
                <h3 className="font-black uppercase tracking-widest text-sm mb-4">Email Us</h3>
                <p className="text-zinc-500 text-sm">{formData.email}</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="p-8 bg-zinc-50 border h-full">
                <Phone className="w-6 h-6 mb-6" style={{ color: brand }} />
                <h3 className="font-black uppercase tracking-widest text-sm mb-4">Call Us</h3>
                <p className="text-zinc-500 text-sm">{formData.phone || "Mon-Sat 9AM-6PM"}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="py-20 bg-red-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <Zap className="w-8 h-8 fill-current" />
              <span className="text-xl font-black uppercase tracking-[0.3em]">Flash Sale</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Limited Time Offer</h2>
          </Reveal>

          <div className="flex gap-8 items-center font-black">
            {[
              { val: "02", label: "Hours" },
              { val: "45", label: "Mins" },
              { val: "12", label: "Secs" },
            ].map((t, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl md:text-7xl tracking-tighter leading-none">{t.val}</div>
                <div className="text-[10px] uppercase tracking-widest mt-2 opacity-60">{t.label}</div>
              </div>
            ))}
          </div>

          <Reveal delay={0.2}>
            <button onClick={() => goTo("shop")} className="px-12 py-5 bg-white text-red-600 font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all">
              Claim 40% Off
            </button>
          </Reveal>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <Reveal>
            <div className="text-xs font-black uppercase tracking-[0.4em] mb-8" style={{ color: brand }}>Our Philosophy</div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-12 leading-[0.9]">Crafted for the <br />Discerning.</h2>
            <p className="text-xl text-zinc-500 leading-relaxed mb-12 italic">
              Every piece in our collection is a testament to our commitment to quality, sustainability, and timeless design. We don&apos;t just sell products; we deliver experiences that last a lifetime.
            </p>
            <div className="flex gap-12">
              <div>
                <div className="text-4xl font-black mb-2 tracking-tighter italic">100%</div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Organic Materials</div>
              </div>
              <div className="w-px h-16 bg-zinc-100" />
              <div>
                <div className="text-4xl font-black mb-2 tracking-tighter italic">Ethical</div>
                <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest">Sourcing Policy</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="relative">
            <div className="aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80" className="w-full h-full object-cover" alt="Craftsmanship" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full border-[12px] border-white overflow-hidden shadow-xl hidden lg:block">
              <img src="https://images.unsplash.com/photo-1544441893-675973e31985?w=400&q=80" className="w-full h-full object-cover" alt="Detail" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <section className="py-32 bg-zinc-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-20 flex justify-between items-end">
          <Reveal>
            <h2 className="text-4xl font-black uppercase tracking-tighter">@ {formData.businessName.replace(/\s+/g, '_').toLowerCase()}</h2>
            <p className="text-zinc-400 mt-4 uppercase text-[10px] font-bold tracking-widest">Follow us for daily inspiration</p>
          </Reveal>
          <button className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest">
            <Globe className="w-4 h-4" /> View Profile
          </button>
        </div>

        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {[
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80",
            "https://images.unsplash.com/photo-1441984904996-e0b6ba687e12?w=400&q=80",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
            "https://images.unsplash.com/photo-1470309634658-8efe215a9edb?w=400&q=80",
            "https://images.unsplash.com/photo-1539109132381-31a1b973f0ea?w=400&q=80",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
            "https://images.unsplash.com/photo-1529139513055-119712d289b5?w=400&q=80",
            "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80",
          ].map((img, i) => (
            <div key={i} className="w-64 h-64 flex-shrink-0 relative group">
              <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCT SPOTLIGHT */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-zinc-900 rounded-[60px] overflow-hidden flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 p-16 md:p-24 text-white">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/10">
                  <Star className="w-3 h-3 fill-white" /> Item of the month
                </div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic leading-none">The Onyx <br />Series v2.</h2>
                <p className="text-xl text-white/50 mb-12 leading-relaxed">
                  Redefining the standards of modern luxury. Engineered with high-tensile materials and hand-finished for an unparalleled tactile experience.
                </p>
                <div className="flex gap-8 items-end mb-16">
                  <span className="text-5xl font-black">$499</span>
                  <span className="text-white/30 line-through text-2xl">$650</span>
                </div>
                <button onClick={() => goTo("shop")} style={{ background: brand }} className="px-12 py-5 font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 transition-all">
                  Order Now
                </button>
              </Reveal>
            </div>
            <div className="lg:w-1/2 h-full relative aspect-square lg:aspect-auto">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80" className="w-full h-full object-cover grayscale opacity-80" alt="Spotlight" />
              <div className="absolute inset-0 bg-gradient-to-l from-zinc-900/50 to-transparent lg:hidden" />
            </div>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP / LOYALTY */}
      <section className="py-32 bg-zinc-50 border-y">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <Reveal className="col-span-1">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Join the Inner Circle.</h2>
            <p className="text-zinc-500 leading-relaxed italic">Unlock exclusive benefits, early access, and personalized rewards designed for our most loyal community members.</p>
          </Reveal>

          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { icon: <Gift />, title: "Reward Points", desc: "Earn points on every purchase and redeem them for future collections." },
              { icon: <Clock />, title: "Early Access", desc: "Be the first to shop limited releases before they hit the main store." },
              { icon: <Award />, title: "VIP Events", desc: "Invites to private showcase events and digital masterclasses." },
              { icon: <HelpCircle />, title: "Concierge", desc: "Dedicated 24/7 support for all your product and styling needs." },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 bg-white border rounded-3xl group hover:border-transparent hover:shadow-2xl transition-all duration-500">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110" style={{ background: brand + '10', color: brand }}>{item.icon}</div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-4">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal className="text-center mb-24">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-6">Concierge Support</h2>
            <p className="text-zinc-500 italic">Everything you need to know about our products and services.</p>
          </Reveal>

          <div className="space-y-6">
            {[
              { q: "What is your global shipping policy?", a: "We offer express worldwide shipping. Most orders arrive within 3-5 business days. Customs and duties are calculated at checkout." },
              { q: "Do you offer a satisfaction guarantee?", a: "Yes, we provide a 30-day no-questions-asked return policy for all unworn items in their original packaging." },
              { q: "How do I track my order status?", a: "Once your order is dispatched, you will receive a tracking link via email and SMS to monitor its progress in real-time." },
            ].map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="p-8 border rounded-3xl group hover:bg-zinc-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black uppercase tracking-widest text-sm">{f.q}</span>
                    <Plus className="w-4 h-4 text-zinc-400 group-hover:rotate-90 transition-transform" />
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-900 transition-colors">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRE-FOOTER PROMO */}
      <section className="py-40 bg-zinc-900 relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30 grayscale blur-xl"
        >
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80" className="w-full h-full object-cover" alt="" />
        </motion.div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-6xl md:text-[8vw] font-black uppercase tracking-tighter text-white italic mb-16 leading-none">The Future <br />Of Style<span style={{ color: brand }}>.</span></h2>
            <button onClick={() => goTo("shop")} style={{ background: brand }} className="px-16 py-8 text-white font-black uppercase tracking-[0.3em] text-sm shadow-[0_0_80px_rgba(0,0,0,0.5)] hover:scale-105 transition-all">
              Elevate Your Collection
            </button>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable product card (shared between Home and Shop)
// ─────────────────────────────────────────────────────────────────────────────
function ProductCard({ p, brand, addToCart, onSelect }: { p: Product; brand: string; addToCart: (p: Product) => void; onSelect: () => void }) {
  return (
    <TiltCard>
      <div className="group bg-white border border-zinc-100 overflow-hidden">
        <button onClick={onSelect} className="relative aspect-[3/4] overflow-hidden block w-full">
          <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white text-[10px] font-black uppercase tracking-widest border border-zinc-100">{p.category}</span>
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white text-zinc-900 px-8 py-3 font-bold uppercase text-xs tracking-widest">Voir le produit</span>
          </div>
        </button>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <button onClick={onSelect} className="font-bold text-lg text-left hover:opacity-70 transition-opacity">{p.name}</button>
            <div className="flex items-center gap-1 text-amber-500"><Star className="w-3 h-3 fill-current" /> <span className="text-xs font-bold">{p.rating}</span></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl font-black" style={{ color: brand }}>${p.price}</div>
            <button
              onClick={() => addToCart(p)}
              className="text-[10px] font-black uppercase tracking-widest border border-zinc-900 px-4 py-2 hover:bg-zinc-900 hover:text-white transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHOP PAGE (full product listing + filters)
// ─────────────────────────────────────────────────────────────────────────────
function ShopPage({
  products, brand, businessName, filter, setFilter, addToCart, onSelect,
}: {
  products: Product[];
  brand: string;
  businessName: string;
  filter: string;
  setFilter: (s: string) => void;
  addToCart: (p: Product) => void;
  onSelect: (p: Product) => void;
}) {
  const filtered = filter === "All" ? products : products.filter(p => p.category === filter);

  return (
    <>
      {/* Page header band */}
      <section className="bg-zinc-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-60">Boutique</div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">{businessName}</h1>
            <p className="text-white/50 mt-6 max-w-xl text-lg">Explorez l&apos;intégralité de notre collection. Chaque pièce est sélectionnée avec soin pour sa qualité et son design.</p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-zinc-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-4 mb-16">
            {["All", "Featured", "New Arrivals", "Bestsellers"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all ${filter === cat ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-400 hover:text-zinc-900 border'}`}
              >
                {cat === "All" ? "Tout" : cat}
              </button>
            ))}
          </div>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map(p => (
              <StaggerItem key={p.id}>
                <ProductCard p={p} brand={brand} addToCart={addToCart} onSelect={() => onSelect(p)} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DETAIL
// ─────────────────────────────────────────────────────────────────────────────
function ProductDetail({
  product, brand, addToCart, onBack, relatedProducts, onSelect,
}: {
  product: Product;
  brand: string;
  addToCart: (p: Product) => void;
  onBack: () => void;
  relatedProducts: Product[];
  onSelect: (p: Product) => void;
}) {
  return (
    <section className="py-16 bg-white min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-6">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Retour à la boutique
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <div className="aspect-[3/4] overflow-hidden bg-zinc-100 border border-zinc-100">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col h-full">
              <span className="px-3 py-1 bg-zinc-100 text-[10px] font-black uppercase tracking-widest self-start mb-6">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-6">{product.name}</h1>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-sm font-bold text-zinc-400">{product.rating} / 5</span>
              </div>
              <div className="text-4xl font-black mb-10" style={{ color: brand }}>${product.price}</div>
              <p className="text-lg text-zinc-500 leading-relaxed mb-12">{product.description}</p>

              <div className="flex flex-wrap gap-4 mb-12">
                <button
                  onClick={() => addToCart(product)}
                  style={{ background: brand }}
                  className="flex-1 min-w-[200px] px-10 py-5 text-white font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all"
                >
                  Ajouter au panier
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-zinc-100 pt-10 mt-auto">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400"><Truck className="w-5 h-5 text-zinc-900" /> Livraison offerte</div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400"><ShieldCheck className="w-5 h-5 text-zinc-900" /> Paiement sécurisé</div>
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-400"><RotateCcw className="w-5 h-5 text-zinc-900" /> Retour 30 jours</div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related */}
        <div className="mt-32">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-12">Vous aimerez aussi</h2>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {relatedProducts.map(p => (
              <StaggerItem key={p.id}>
                <ProductCard p={p} brand={brand} addToCart={addToCart} onSelect={() => onSelect(p)} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG INDEX
// ─────────────────────────────────────────────────────────────────────────────
function BlogIndex({ brand, onSelect }: { brand: string; onSelect: (a: Article) => void }) {
  const [featured, ...rest] = ARTICLES;
  return (
    <>
      <section className="bg-zinc-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-60">Journal</div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Le Blog</h1>
            <p className="text-white/50 mt-6 max-w-xl text-lg">Actualités, conseils et coulisses. Plongez dans l&apos;univers de notre maison.</p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Featured article */}
          <Reveal>
            <button onClick={() => onSelect(featured)} className="group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 text-left w-full">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={featured.cover} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6" style={{ color: brand }}>
                  <Calendar className="w-4 h-4" /> {featured.date}
                </div>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-6 group-hover:opacity-70 transition-opacity">{featured.title}</h2>
                <p className="text-lg text-zinc-500 leading-relaxed mb-8">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  Lire l&apos;article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          </Reveal>

          {/* Grid */}
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {rest.map(a => (
              <StaggerItem key={a.id}>
                <button onClick={() => onSelect(a)} className="group block text-left w-full h-full">
                  <div className="aspect-[4/3] overflow-hidden mb-6">
                    <img src={a.cover} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3 text-zinc-400">
                    <Calendar className="w-3 h-3" /> {a.date}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-3 group-hover:opacity-70 transition-opacity">{a.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{a.excerpt}</p>
                </button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOG ARTICLE (single reading view)
// ─────────────────────────────────────────────────────────────────────────────
function BlogArticle({ article, brand, onBack }: { article: Article; brand: string; onBack: () => void }) {
  return (
    <article className="bg-white min-h-[70vh]">
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden bg-zinc-900">
        <img src={article.cover} alt={article.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 h-full flex flex-col justify-end pb-16 text-white">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-6">
            <Calendar className="w-4 h-4" /> {article.date}
          </div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">{article.title}</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Retour au blog
        </button>

        <div className="w-20 h-2 mb-12" style={{ background: brand }} />

        <div className="space-y-8">
          {article.body.map((para, i) => (
            <p key={i} className="text-lg md:text-xl text-zinc-600 leading-relaxed">{para}</p>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-100 text-xs uppercase tracking-widest text-zinc-400 font-bold">
          Merci de votre lecture.
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// À PROPOS
// ─────────────────────────────────────────────────────────────────────────────
function AboutPage({
  formData, c, brand, goTo,
}: {
  formData: SessionData["formData"];
  c: SessionData["generatedContent"];
  brand: string;
  goTo: (p: Page) => void;
}) {
  const values = [
    { icon: <Award />, title: "Exigence", desc: "Nous ne transigeons jamais sur la qualité. Chaque pièce est contrôlée et pensée pour durer." },
    { icon: <ShieldCheck />, title: "Confiance", desc: "Transparence sur nos matières, nos prix et nos engagements. Une relation honnête avec notre communauté." },
    { icon: <Gift />, title: "Passion", desc: "Une équipe animée par l'amour du beau et du bien-fait, au service de votre quotidien." },
  ];
  const team = [
    { name: "Camille Durand", role: "Fondatrice & Direction artistique", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
    { name: "Thomas Bernard", role: "Responsable production", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" },
    { name: "Léa Martin", role: "Relation client", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
  ];

  return (
    <>
      {/* Header band */}
      <section className="bg-zinc-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-60">Notre maison</div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">À propos</h1>
            <p className="text-white/50 mt-6 max-w-xl text-lg">L&apos;histoire, les valeurs et les visages derrière {formData.businessName}.</p>
          </Reveal>
        </div>
      </section>

      {/* Brand story */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <Reveal>
            <div className="text-xs font-black uppercase tracking-[0.4em] mb-8" style={{ color: brand }}>Notre histoire</div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-10 leading-tight">Née d&apos;une conviction simple.</h2>
            <div className="space-y-6 text-lg text-zinc-500 leading-relaxed">
              <p>{c?.aboutText || `${formData.businessName} est née d'une conviction simple : il est possible de proposer des produits d'exception, fabriqués dans le respect des hommes et de l'environnement, sans jamais sacrifier le style ni la qualité.`}</p>
              <p>Depuis nos débuts à {formData.city || "Lyon"}, nous cultivons un savoir-faire artisanal et une relation de proximité avec celles et ceux qui nous font confiance. Chaque collection raconte une histoire, la nôtre comme la vôtre.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="aspect-[4/5] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80" alt="Notre atelier" className="w-full h-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-zinc-50 border-y">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Nos valeurs</h2>
            <div className="w-20 h-2 mt-6" style={{ background: brand }} />
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <StaggerItem key={i}>
                <div className="p-10 bg-white border h-full">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-8" style={{ background: brand + '10', color: brand }}>{v.icon}</div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-4">{v.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal className="mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter">L&apos;équipe</h2>
            <div className="w-20 h-2 mt-6" style={{ background: brand }} />
          </Reveal>
          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((m, i) => (
              <StaggerItem key={i}>
                <div className="group">
                  <div className="aspect-[4/5] overflow-hidden mb-6">
                    <img src={m.img} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">{m.name}</h3>
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-bold mt-2">{m.role}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-zinc-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">Envie d&apos;en savoir plus ?</h2>
            <p className="text-white/50 mb-12 text-lg">Découvrez notre collection ou contactez-nous, nous serons ravis d&apos;échanger.</p>
            <div className="flex flex-wrap gap-6 justify-center">
              <button onClick={() => goTo("shop")} style={{ background: brand }} className="px-10 py-5 font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all">Voir la boutique</button>
              <button onClick={() => goTo("contact")} className="px-10 py-5 border-2 border-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-zinc-900 transition-all">Nous contacter</button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────
function ContactPage({ formData, brand }: { formData: SessionData["formData"]; brand: string }) {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="bg-zinc-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-60">Nous écrire</div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Contact</h1>
            <p className="text-white/50 mt-6 max-w-xl text-lg">Une question, une commande, une collaboration ? Notre équipe vous répond.</p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 bg-zinc-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <Reveal>
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">Coordonnées</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-5 p-6 bg-white border">
                <Mail className="w-6 h-6 flex-shrink-0" style={{ color: brand }} />
                <div>
                  <div className="font-black uppercase tracking-widest text-xs mb-1">Email</div>
                  <a href={`mailto:${formData.email}`} className="text-zinc-500 text-sm hover:text-zinc-900 transition-colors">{formData.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-5 p-6 bg-white border">
                <Phone className="w-6 h-6 flex-shrink-0" style={{ color: brand }} />
                <div>
                  <div className="font-black uppercase tracking-widest text-xs mb-1">Téléphone</div>
                  <p className="text-zinc-500 text-sm">{formData.phone || "Du lundi au samedi, 9h–18h"}</p>
                </div>
              </div>
              <div className="flex items-start gap-5 p-6 bg-white border">
                <MapPin className="w-6 h-6 flex-shrink-0" style={{ color: brand }} />
                <div>
                  <div className="font-black uppercase tracking-widest text-xs mb-1">Ville</div>
                  <p className="text-zinc-500 text-sm">{formData.city || "Lyon, France"}</p>
                </div>
              </div>
              <div className="flex items-start gap-5 p-6 bg-white border">
                <Clock className="w-6 h-6 flex-shrink-0" style={{ color: brand }} />
                <div>
                  <div className="font-black uppercase tracking-widest text-xs mb-1">Horaires</div>
                  <p className="text-zinc-500 text-sm">Lun–Sam : 9h–18h · Dim : fermé</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <div className="bg-white border p-8 md:p-10">
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-10">Écrivez-nous</h2>
              {sent ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white" style={{ background: brand }}><Mail className="w-7 h-7" /></div>
                  <p className="font-black uppercase tracking-widest text-sm mb-2">Message envoyé</p>
                  <p className="text-zinc-500 text-sm">Merci, nous revenons vers vous très vite.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6">
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-zinc-500">Nom</label>
                    <input required type="text" placeholder="Votre nom" className="w-full px-5 py-4 border border-zinc-200 outline-none text-base focus:border-zinc-900 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-zinc-500">Email</label>
                    <input required type="email" placeholder="vous@email.com" className="w-full px-5 py-4 border border-zinc-200 outline-none text-base focus:border-zinc-900 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest mb-2 text-zinc-500">Message</label>
                    <textarea required rows={5} placeholder="Votre message…" className="w-full px-5 py-4 border border-zinc-200 outline-none text-base focus:border-zinc-900 transition-colors resize-none" />
                  </div>
                  <button type="submit" style={{ background: brand }} className="w-full py-5 text-white font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all">Envoyer le message</button>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Long-form legal layout helper
// ─────────────────────────────────────────────────────────────────────────────
function LegalShell({ kicker, title, brand, children }: { kicker: string; title: string; brand: string; children: React.ReactNode }) {
  return (
    <>
      <section className="bg-zinc-900 text-white py-24">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-60">{kicker}</div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">{title}</h1>
          </Reveal>
        </div>
      </section>
      <section className="py-20 bg-white min-h-[60vh]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="w-20 h-2 mb-16" style={{ background: brand }} />
          <div className="space-y-12">{children}</div>
        </div>
      </section>
    </>
  );
}

function LegalBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <div>
        <h2 className="text-lg font-black uppercase tracking-widest mb-4">{heading}</h2>
        <div className="text-zinc-600 leading-relaxed space-y-3 text-base">{children}</div>
      </div>
    </Reveal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CGV (Conditions Générales de Vente)
// ─────────────────────────────────────────────────────────────────────────────
function CgvPage({ brand, businessName }: { brand: string; businessName: string }) {
  return (
    <LegalShell kicker="Informations légales" title="Conditions Générales de Vente" brand={brand}>
      <p className="text-zinc-500 italic">
        Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre {businessName} et ses clients dans le cadre de la vente en ligne de ses produits. Toute commande implique l&apos;acceptation sans réserve des présentes CGV.
      </p>

      <LegalBlock heading="Article 1 — Objet">
        <p>Les présentes conditions ont pour objet de définir les droits et obligations des parties dans le cadre de la vente en ligne des produits proposés par {businessName} à ses clients. Elles s&apos;appliquent à l&apos;exclusion de toute autre condition.</p>
      </LegalBlock>

      <LegalBlock heading="Article 2 — Produits">
        <p>Les produits proposés à la vente sont ceux décrits sur le site au jour de la consultation par le client. Les photographies et descriptifs sont les plus fidèles possibles mais ne sauraient engager la responsabilité du vendeur en cas de différence mineure. Les produits sont proposés dans la limite des stocks disponibles.</p>
      </LegalBlock>

      <LegalBlock heading="Article 3 — Prix">
        <p>Les prix sont indiqués en euros toutes taxes comprises (TTC), hors frais de livraison. {businessName} se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable au client.</p>
      </LegalBlock>

      <LegalBlock heading="Article 4 — Commande">
        <p>Le client passe commande directement sur le site. La vente ne sera considérée comme définitive qu&apos;après l&apos;envoi au client de la confirmation de l&apos;acceptation de la commande par le vendeur et après encaissement de l&apos;intégralité du prix.</p>
      </LegalBlock>

      <LegalBlock heading="Article 5 — Paiement">
        <p>Le règlement des achats s&apos;effectue par carte bancaire ou tout autre moyen proposé sur le site. Les paiements sont sécurisés. La commande validée par le client ne sera considérée effective que lorsque le paiement aura été confirmé.</p>
      </LegalBlock>

      <LegalBlock heading="Article 6 — Livraison">
        <p>Les produits sont livrés à l&apos;adresse de livraison indiquée par le client lors de la commande. Les délais de livraison sont donnés à titre indicatif. {businessName} ne saurait être tenu responsable des conséquences dues à un retard d&apos;acheminement imputable au transporteur.</p>
      </LegalBlock>

      <LegalBlock heading="Article 7 — Droit de rétractation">
        <p>Conformément à l&apos;article L.221-18 du Code de la consommation, le client dispose d&apos;un délai de quatorze (14) jours à compter de la réception des produits pour exercer son droit de rétractation, sans avoir à justifier de motif. Les produits doivent être retournés dans leur état et emballage d&apos;origine.</p>
      </LegalBlock>

      <LegalBlock heading="Article 8 — Garanties">
        <p>Tous les produits bénéficient de la garantie légale de conformité (articles L.217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil), permettant au client de retourner les produits défectueux ou non conformes.</p>
      </LegalBlock>

      <LegalBlock heading="Article 9 — Données personnelles">
        <p>Les données personnelles collectées font l&apos;objet d&apos;un traitement informatique nécessaire au traitement de la commande. Conformément au RGPD, le client dispose d&apos;un droit d&apos;accès, de rectification et de suppression des données le concernant en écrivant à valentinmilliand@aevia.services.</p>
      </LegalBlock>

      <LegalBlock heading="Article 10 — Droit applicable et litiges">
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.</p>
      </LegalBlock>

      <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold pt-6">Dernière mise à jour : janvier 2026</p>
    </LegalShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MENTIONS LÉGALES (exact facts as specified)
// ─────────────────────────────────────────────────────────────────────────────
function MentionsPage({ brand }: { brand: string }) {
  return (
    <LegalShell kicker="Informations légales" title="Mentions légales" brand={brand}>
      <LegalBlock heading="Éditeur du site">
        <p><strong className="text-zinc-900">Aevia WS</strong> — entrepreneur individuel (auto-entrepreneur).</p>
        <p>Directeur de la publication : <strong className="text-zinc-900">Valentin Milliand</strong>.</p>
        <p>SIREN : <strong className="text-zinc-900">852 546 225</strong> — RCS Bourg-en-Bresse.</p>
        <p>Adresse du siège social communiquée sur demande à valentinmilliand@aevia.services.</p>
      </LegalBlock>

      <LegalBlock heading="Contact">
        <p>Email : <a href="mailto:valentinmilliand@aevia.services" className="font-bold underline decoration-2 underline-offset-2" style={{ color: brand }}>valentinmilliand@aevia.services</a></p>
      </LegalBlock>

      <LegalBlock heading="TVA">
        <p>TVA non applicable, art. 293 B du CGI.</p>
      </LegalBlock>

      <LegalBlock heading="Hébergeur">
        <p>Vercel Inc.</p>
        <p>340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
      </LegalBlock>

      <LegalBlock heading="Propriété intellectuelle">
        <p>L&apos;ensemble des éléments figurant sur ce site (textes, images, logos, graphismes) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable est interdite et constitutive de contrefaçon.</p>
      </LegalBlock>

      <LegalBlock heading="Données personnelles">
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, adressez votre demande à valentinmilliand@aevia.services.</p>
      </LegalBlock>
    </LegalShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CART DRAWER (shared)
// ─────────────────────────────────────────────────────────────────────────────
function CartDrawer({
  cart, setCart, isCartOpen, setIsCartOpen, brand,
}: {
  cart: { id: number; name: string; price: number; qty: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ id: number; name: string; price: number; qty: number }[]>>;
  isCartOpen: boolean;
  setIsCartOpen: (b: boolean) => void;
  brand: string;
}) {
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-[1000] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[1001] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                <span className="font-black uppercase tracking-widest text-lg">Votre Panier</span>
                <span className="bg-zinc-100 text-zinc-500 text-xs px-2 py-0.5 rounded-full">{cart.reduce((a, b) => a + b.qty, 0)}</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="hover:rotate-90 transition-transform"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="uppercase text-xs font-bold tracking-widest">Panier vide</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-6 items-center">
                      <div className="w-20 h-24 bg-zinc-100 overflow-hidden flex-shrink-0">
                        <img src={`https://images.unsplash.com/photo-${1500000000000 + item.id * 1000}?w=200&q=80`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold mb-1">{item.name}</div>
                        <div className="text-zinc-500 text-sm mb-4">${item.price}</div>
                        <div className="flex items-center gap-4">
                          <button className="p-1 border hover:bg-zinc-50" onClick={() => setCart(prev => prev.map(i => i.id === item.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))}><Minus className="w-3 h-3" /></button>
                          <span className="font-bold text-sm">{item.qty}</span>
                          <button className="p-1 border hover:bg-zinc-50" onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <button className="text-zinc-300 hover:text-red-500 transition-colors" onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 border-t bg-zinc-50">
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold uppercase text-xs tracking-widest text-zinc-400">Total</span>
                <span className="text-2xl font-black">${cart.reduce((a, b) => a + b.price * b.qty, 0)}</span>
              </div>
              <button
                disabled={cart.length === 0}
                style={{ background: brand }}
                className="w-full py-5 rounded-none text-white font-black uppercase tracking-[0.2em] text-sm shadow-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:grayscale"
              >
                Commander
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
