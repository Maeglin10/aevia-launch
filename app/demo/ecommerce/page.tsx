"use client";

import { useState, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ShoppingCart,
  Star,
  ChevronRight,
  Package,
  Truck,
  RotateCcw,
  Shield,
  Image as ImageIcon,
  X,
  Plus,
  Minus,
  Menu,
  Check,
  ArrowRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// CSS custom properties — theme tokens (replaced by design themes at skin time)
// ---------------------------------------------------------------------------
const CSS_VARS = `
:root {
  --brand-primary: #f59e0b;
  --brand-secondary: #ea580c;
  --brand-gradient: linear-gradient(135deg, #f59e0b, #ea580c);
  --bg-primary: #0d0d0f;
  --text-primary: #ffffff;
  --text-muted: #71717a;
  --card-bg: rgba(255,255,255,0.02);
}
`;

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
type Category = "Tous" | "Vases" | "Carafes" | "Plateaux" | "Bougies" | "Lampes";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  tag: string;
  rating: number;
  reviews: number;
  category: Category;
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Vase Céramique Brut",
    price: 89,
    originalPrice: 120,
    tag: "Nouveau",
    rating: 4.8,
    reviews: 24,
    category: "Vases",
    description:
      "Façonné à la main dans notre atelier de Marseille, ce vase en céramique brute révèle la beauté des imperfections naturelles. Chaque pièce est unique.",
  },
  {
    id: 2,
    name: "Carafe en Verre Soufflé",
    price: 145,
    originalPrice: null,
    tag: "Bestseller",
    rating: 5.0,
    reviews: 87,
    category: "Carafes",
    description:
      "Soufflée à la bouche par nos maîtres verriers, cette carafe allie tradition et modernité. Sa silhouette épurée sublime votre table.",
  },
  {
    id: 3,
    name: "Plateau Laiton Martelé",
    price: 210,
    originalPrice: 265,
    tag: "Exclusif",
    rating: 4.9,
    reviews: 41,
    category: "Plateaux",
    description:
      "Chaque coup de marteau sur ce plateau en laiton massif crée une texture unique. Un savoir-faire ancestral au service de l'esthétique contemporaine.",
  },
  {
    id: 4,
    name: "Bougie Soja Signature",
    price: 48,
    originalPrice: null,
    tag: "Nouveau",
    rating: 4.7,
    reviews: 132,
    category: "Bougies",
    description:
      "Formulée avec de la cire de soja éthique et des huiles essentielles rares, notre bougie signature parfume vos espaces pendant 60 heures.",
  },
  {
    id: 5,
    name: "Coupe Marbre Blanc",
    price: 175,
    originalPrice: 220,
    tag: "Bestseller",
    rating: 4.9,
    reviews: 63,
    category: "Plateaux",
    description:
      "Taillée dans un marbre blanc de Carrare sélectionné pour ses veines naturelles, cette coupe est une sculpture fonctionnelle pour votre intérieur.",
  },
  {
    id: 6,
    name: "Lampe Raku Artisanale",
    price: 320,
    originalPrice: null,
    tag: "Exclusif",
    rating: 5.0,
    reviews: 18,
    category: "Lampes",
    description:
      "La technique ancestrale du Raku donne à chaque lampe sa peau unique — craquelée, irisée, vivante. Une source de lumière et d'art à la fois.",
  },
];

const CATEGORIES: Category[] = ["Tous", "Vases", "Carafes", "Plateaux", "Bougies", "Lampes"];

const TAG_STYLES: Record<string, string> = {
  Nouveau: "bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-500/30",
  Bestseller: "bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary)]/30",
  Exclusif: "bg-violet-900/60 text-violet-300 ring-1 ring-violet-500/30",
};

const PERKS = [
  { icon: Truck, title: "Livraison offerte", description: "Dès 80€ d'achat" },
  { icon: RotateCcw, title: "Retours 30 jours", description: "Sans question" },
  { icon: Shield, title: "Paiement sécurisé", description: "SSL + 3D Secure" },
  { icon: Package, title: "Emballage cadeau", description: "Offert sur demande" },
];

const REVIEWS = [
  {
    id: 1,
    name: "Sophie L.",
    rating: 5,
    quote:
      "La qualité est vraiment exceptionnelle. Mon vase est arrivé parfaitement emballé et dépasse toutes mes attentes.",
  },
  {
    id: 2,
    name: "Thomas M.",
    rating: 5,
    quote:
      "ARKE Studio a redéfini ce que signifie posséder un objet d'artisanat. La carafe est ma pièce préférée du salon.",
  },
  {
    id: 3,
    name: "Élise R.",
    rating: 5,
    quote:
      "Le service client est aussi soigné que les produits. Une expérience d'achat véritablement luxueuse.",
  },
  {
    id: 4,
    name: "Marc D.",
    rating: 4,
    quote:
      "Des pièces uniques que vous ne trouverez nulle part ailleurs. La bougie Signature est devenue indispensable.",
  },
];

const NAV_LINKS = [
  { label: "Collections", href: "#products" },
  { label: "Notre histoire", href: "#histoire" },
  { label: "Avis", href: "#avis" },
  { label: "Newsletter", href: "#newsletter" },
];

// ---------------------------------------------------------------------------
// Framer-motion variants
// ---------------------------------------------------------------------------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const panelVariant: Variants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 28, stiffness: 300 } },
  exit: { x: "100%", opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const modalVariant: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.94, y: 20, transition: { duration: 0.2 } },
};

const menuVariant: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

// ---------------------------------------------------------------------------
// Cart types
// ---------------------------------------------------------------------------
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Image zone placeholder — replaced by real <Image> at skin time */
function ImageZone({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    /* [ZONE_IMAGE: see label prop — replace with next/image at skin time] */
    <div
      className={`relative bg-zinc-800/50 flex items-center justify-center border border-white/6 ${className ?? ""}`}
    >
      <div className="text-center text-zinc-600">
        <ImageIcon className="w-8 h-8 mx-auto mb-1" />
        <p className="text-xs font-mono">{label}</p>
      </div>
    </div>
  );
}

/** 3D-tilt product card */
function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  justAdded,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  justAdded: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 8, y: dx * 8 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      layout
      variants={cardVariant}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="group rounded-2xl border border-white/6 overflow-hidden bg-[var(--card-bg)] hover:border-white/12 transition-colors duration-300 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => onQuickView(product)}
      >
        {/* [ZONE_IMAGE: PRODUCT_IMG — 400x400px, product photo on neutral background] */}
        <div className="relative h-52 bg-zinc-800/50 flex items-center justify-center border-b border-white/6">
          <div className="text-center text-zinc-700">
            <ImageIcon className="w-8 h-8 mx-auto mb-1" />
            <p className="text-xs font-mono">Photo produit</p>
          </div>
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TAG_STYLES[product.tag]}`}>
              {product.tag}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-tight mb-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-3 h-3 ${
                    j < Math.floor(product.rating)
                      ? "text-[var(--brand-primary)] fill-[var(--brand-primary)]"
                      : "text-zinc-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-[var(--text-muted)]">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[var(--text-primary)]">{product.price}€</span>
              {product.originalPrice && (
                <span className="text-sm text-zinc-600 line-through">{product.originalPrice}€</span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                justAdded
                  ? "bg-emerald-600 text-white scale-95"
                  : "bg-[var(--brand-primary)] hover:opacity-90 text-black"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3 h-3" /> Ajouté
                </>
              ) : (
                "Ajouter"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Cart side panel */
function CartPanel({
  items,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  items: CartItem[];
  onClose: () => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.aside
        variants={panelVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-zinc-950 border-l border-white/8 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <h2 className="font-bold text-white tracking-wide">Mon panier</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/8 transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center text-[var(--text-muted)]">
              <ShoppingCart className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Votre panier est vide</p>
            </div>
          )}
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex gap-4 items-center p-3 rounded-xl border border-white/6 bg-white/2"
              >
                {/* [ZONE_IMAGE: CART_THUMB — 64x64px] */}
                <div className="w-16 h-16 rounded-lg bg-zinc-800/70 flex items-center justify-center shrink-0 border border-white/6">
                  <ImageIcon className="w-5 h-5 text-zinc-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                  <p className="text-sm text-[var(--brand-primary)] font-bold mt-0.5">
                    {item.price}€
                  </p>
                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onDecrement(item.id)}
                      className="w-6 h-6 rounded-full border border-white/12 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onIncrement(item.id)}
                      className="w-6 h-6 rounded-full border border-white/12 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 rounded-full text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)]">Sous-total</span>
            <span className="text-lg font-bold text-white">{subtotal}€</span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Livraison calculée à l&apos;étape suivante</p>
          <button className="w-full py-3.5 rounded-full font-bold text-sm text-black transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-gradient)" }}
          >
            Commander →
          </button>
        </div>
      </motion.aside>
    </>
  );
}

/** Product quick-view modal */
function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  justAdded,
}: {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  justAdded: boolean;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          variants={modalVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-auto w-full max-w-2xl bg-zinc-950 border border-white/8 rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* [ZONE_IMAGE: PRODUCT_IMG_LARGE — 500x500px, product on neutral bg] */}
            <div className="relative h-72 md:h-auto bg-zinc-800/50 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/6">
              <div className="text-center text-zinc-700">
                <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                <p className="text-xs font-mono">Photo produit 500x500</p>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-4 left-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TAG_STYLES[product.tag]}`}>
                  {product.tag}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col">
              <h2 className="text-xl font-bold text-white mb-2">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 ${
                        j < Math.floor(product.rating)
                          ? "text-[var(--brand-primary)] fill-[var(--brand-primary)]"
                          : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-[var(--text-muted)]">{product.rating} · {product.reviews} avis</span>
              </div>

              <p className="text-sm text-zinc-400 leading-relaxed mb-6">{product.description}</p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-white">{product.price}€</span>
                {product.originalPrice && (
                  <span className="text-base text-zinc-600 line-through">{product.originalPrice}€</span>
                )}
              </div>

              <button
                onClick={() => onAddToCart(product)}
                className={`w-full py-3.5 rounded-full font-bold text-sm transition-all duration-200 ${
                  justAdded
                    ? "bg-emerald-600 text-white"
                    : "text-black hover:opacity-90"
                }`}
                style={justAdded ? undefined : { background: "var(--brand-gradient)" }}
              >
                {justAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Ajouté au panier
                  </span>
                ) : (
                  "Ajouter au panier"
                )}
              </button>

              <button
                onClick={onClose}
                className="mt-3 text-xs text-[var(--text-muted)] hover:text-white transition-colors text-center"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
export default function EcommerceDemo() {
  // --- State ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>("Tous");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<number | null>(null);
  const [badgeBounce, setBadgeBounce] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");

  // --- Scroll-based parallax ---
  const heroRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroScrollY } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroShapeY = useTransform(heroScrollY, [0, 1], [0, 120]);

  const { scrollYProgress: storyScrollY } = useScroll({
    target: storyRef,
    offset: ["start end", "end start"],
  });
  const storyImgY = useTransform(storyScrollY, [0, 1], [-40, 40]);

  // --- Cart helpers ---
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
    setJustAddedId(product.id);
    setBadgeBounce((n) => n + 1);
    setTimeout(() => setJustAddedId(null), 1400);
  }, []);

  const incrementQty = useCallback((id: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }, []);

  const decrementQty = useCallback((id: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // --- Filtered products ---
  const filteredProducts =
    activeCategory === "Tous"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  // --- Newsletter ---
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Visual validation layer for the required email field.
    if (!newsletterEmail.trim()) {
      setNewsletterError("L'adresse email est requise");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      setNewsletterError("Adresse email invalide");
      return;
    }
    setNewsletterError("");
    setNewsletterSubmitted(true);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* Inject CSS custom properties */}
      <style dangerouslySetInnerHTML={{ __html: CSS_VARS }} />

      <div
        className="min-h-screen overflow-x-hidden"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        {/* ── Ambient background ── */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--brand-primary)]/5 blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--brand-secondary)]/5 blur-[120px]" />
        </div>

        {/* ──────────────────────── HEADER ──────────────────────── */}
        <header className="sticky top-0 z-40 border-b border-white/6 backdrop-blur-xl"
          style={{ backgroundColor: "color-mix(in srgb, var(--bg-primary) 85%, transparent)" }}
        >
          <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center gap-0">
              <span className="text-lg font-bold tracking-[0.12em] uppercase text-white">ARKE</span>
              <span className="text-[var(--brand-primary)] text-lg font-bold tracking-[0.12em]"> Studio</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-zinc-400 hover:text-white transition-colors tracking-wide"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-full border border-zinc-800 hover:border-zinc-600 transition-colors group"
                aria-label="Ouvrir le panier"
              >
                <ShoppingCart className="w-5 h-5 text-zinc-300 group-hover:text-white transition-colors" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={badgeBounce}
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.4, 1] }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.35, type: "spring" }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brand-primary)] text-[10px] font-bold text-black flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Hamburger (mobile) */}
              <button
                className="md:hidden p-2.5 rounded-full border border-zinc-800 hover:border-zinc-600 transition-colors"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-zinc-300" />
              </button>
            </div>
          </div>
        </header>

        {/* ──────────────────────── MOBILE MENU ──────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
              />
              <motion.nav
                variants={menuVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-16 left-0 right-0 z-30 md:hidden border-b border-white/8 px-6 py-6 space-y-1"
                style={{ backgroundColor: "var(--bg-primary)" }}
              >
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 text-base text-zinc-300 hover:text-white border-b border-white/6 last:border-0 transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-zinc-600" />
                  </a>
                ))}
              </motion.nav>
            </>
          )}
        </AnimatePresence>

        {/* ──────────────────────── HERO ──────────────────────── */}
        <section ref={heroRef} className="relative pt-8 pb-16 px-6 overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <div
              className="rounded-3xl border border-white/6 overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #1a1408 0%, #0d0d0f 50%, #130f08 100%)" }}
            >
              {/* Decorative right zone — hero parallax shape */}
              <div className="absolute right-0 top-0 w-[500px] h-full pointer-events-none hidden md:block">
                <div className="absolute inset-0 bg-gradient-to-l from-[var(--brand-primary)]/15 via-[var(--brand-secondary)]/8 to-transparent" />
                <motion.div
                  style={{ y: heroShapeY }}
                  className="absolute right-16 top-1/2 -translate-y-1/2"
                >
                  <div className="w-72 h-72 rounded-full bg-gradient-to-br from-[var(--brand-primary)]/30 to-[var(--brand-secondary)]/20 blur-[1px] border border-[var(--brand-primary)]/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* [ZONE_IMAGE: HERO_FEATURED — 280x280px, hero product on transparent] */}
                    <ImageZone label="Hero featured 280x280" className="w-44 h-44 rounded-2xl" />
                  </div>
                </motion.div>

                {/* Dot grid */}
                <div className="absolute right-8 top-8 grid grid-cols-8 gap-3">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[var(--brand-primary)]/15" />
                  ))}
                </div>
              </div>

              {/* Left content */}
              <div className="relative p-12 md:p-16 max-w-lg">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-4 block"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    Collection Printemps 2025
                  </span>
                  <h1 className="text-5xl font-bold leading-tight mb-4 tracking-tight">
                    Objets
                    <br />
                    <span
                      className="text-transparent bg-clip-text"
                      style={{ backgroundImage: "var(--brand-gradient)" }}
                    >
                      d&apos;exception
                    </span>
                  </h1>
                  <p className="text-zinc-400 text-base leading-relaxed mb-8 max-w-sm">
                    Chaque pièce est créée à la main par des artisans sélectionnés. Des objets qui
                    racontent une histoire, qui durent une vie.
                  </p>
                  <div className="flex items-center gap-4">
                    <a
                      href="#products"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-black font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
                      style={{
                        background: "var(--brand-gradient)",
                        boxShadow: "0 8px 32px color-mix(in srgb, var(--brand-primary) 25%, transparent)",
                      }}
                    >
                      Découvrir la collection
                      <ChevronRight className="w-4 h-4" />
                    </a>
                    <a
                      href="#histoire"
                      className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4 decoration-zinc-700"
                    >
                      Notre histoire
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────── PERKS BAR ──────────────────────── */}
        <section className="px-6 pb-12">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PERKS.map((perk, i) => (
                <motion.div
                  key={perk.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-white/6"
                  style={{ backgroundColor: "var(--card-bg)" }}
                >
                  <div className="mt-0.5 shrink-0" style={{ color: "var(--brand-primary)" }}>
                    <perk.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{perk.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{perk.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────── PRODUCTS ──────────────────────── */}
        <section id="products" className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            {/* Section header */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Catalogue
                </p>
                <h2 className="text-3xl font-bold tracking-tight">Nos créations</h2>
              </div>
              <a
                href="#"
                className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                Voir tout <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Category filter tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                    activeCategory === cat
                      ? "text-black border-transparent"
                      : "text-zinc-400 border-white/12 hover:text-white hover:border-white/20"
                  }`}
                  style={
                    activeCategory === cat
                      ? { background: "var(--brand-gradient)" }
                      : {}
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <motion.div
              layout
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    onAddToCart={addToCart}
                    justAdded={justAddedId === product.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────── BRAND STORY ──────────────────────── */}
        <section id="histoire" ref={storyRef} className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Parallax image zone */}
              <motion.div style={{ y: storyImgY }} className="relative">
                {/* [ZONE_IMAGE: BRAND_PHOTO — 600x700px, artisan at work or studio] */}
                <ImageZone
                  label="Photo marque 600x700"
                  className="w-full h-[420px] md:h-[560px] rounded-2xl"
                />
                {/* Floating stat card */}
                <div className="absolute -bottom-6 -right-6 bg-zinc-950 border border-white/8 rounded-2xl p-5 shadow-2xl">
                  <p className="text-3xl font-bold text-white">12+</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Artisans partenaires</p>
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                custom={0}
              >
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Notre histoire
                </p>
                <h2 className="text-4xl font-bold leading-snug mb-6">
                  L&apos;artisanat
                  <br />
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: "var(--brand-gradient)" }}
                  >
                    comme manifeste
                  </span>
                </h2>
                <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                  <p>
                    ARKE Studio est né d&apos;une conviction simple : dans un monde de séries et de
                    standardisation, l&apos;objet fait main retrouve une valeur fondamentale.
                  </p>
                  <p>
                    Fondé en 2019 à Marseille, nous sélectionnons des artisans exceptionnels à travers
                    la France et le bassin méditerranéen. Chaque collaboration donne naissance à une
                    collection capsule, en édition limitée.
                  </p>
                  <p>
                    Nos pièces ne se commandent pas à la chaîne — elles se façonnent au rythme des
                    saisons, des matières disponibles, et du talent de nos artisans. C&apos;est cette
                    lenteur assumée qui leur donne leur caractère.
                  </p>
                  <p>
                    Posséder un objet ARKE, c&apos;est entrer dans une relation avec le travail
                    humain. C&apos;est choisir la durée contre l&apos;éphémère.
                  </p>
                </div>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 mt-8 text-sm font-semibold hover:gap-3 transition-all"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Notre histoire complète <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ──────────────────────── CTA BANNER ──────────────────────── */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl border border-[var(--brand-primary)]/20 overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #1c1205 0%, #0d0d0f 60%, #1a1008 100%)" }}
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[var(--brand-primary)]/8 to-transparent" />
              <div className="relative px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5" style={{ color: "var(--brand-primary)" }} />
                    <span
                      className="text-sm font-bold uppercase tracking-widest"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Offre exclusive
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Livraison gratuite dès 80€</h3>
                  <p className="text-zinc-400 text-sm">
                    Profitez de la livraison offerte en France métropolitaine sur toutes vos commandes.
                  </p>
                </div>
                <a
                  href="#products"
                  className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full text-black font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap"
                  style={{ background: "var(--brand-gradient)" }}
                >
                  En profiter <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────── REVIEWS ──────────────────────── */}
        <section id="avis" className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0}
              className="text-center mb-12"
            >
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                style={{ color: "var(--brand-primary)" }}
              >
                Témoignages
              </p>
              <h2 className="text-3xl font-bold">Ce que disent nos clients</h2>
            </motion.div>

            {/* Scrollable row on mobile, 2-col on desktop */}
            <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto pb-2 scrollbar-hide md:overflow-visible">
              {REVIEWS.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="shrink-0 w-72 md:w-auto p-6 rounded-2xl border border-white/6"
                  style={{ backgroundColor: "var(--card-bg)" }}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${
                          j < review.rating
                            ? "text-[var(--brand-primary)] fill-[var(--brand-primary)]"
                            : "text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed mb-5 italic">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3">
                    {/* [ZONE_IMAGE: AVATAR — 40x40px circle] */}
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/8 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4 text-zinc-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">Client vérifié</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────── NEWSLETTER ──────────────────────── */}
        <section id="newsletter" className="px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl border border-white/6 overflow-hidden"
            >
              {/* [ZONE_IMAGE: NEWSLETTER_BG — full-width atmospheric texture or pattern] */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/8 via-transparent to-[var(--brand-secondary)]/6 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--brand-primary)/10,_transparent_60%)] pointer-events-none" />

              <div className="relative px-8 md:px-16 py-16 text-center max-w-xl mx-auto">
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-4"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Communauté
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Rejoignez la communauté ARKE
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                  Avant-premières, accès exclusifs aux nouvelles collections, rencontres avec nos
                  artisans — réservés aux membres.
                </p>

                <AnimatePresence mode="wait">
                  {newsletterSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center"
                      >
                        <Check className="w-7 h-7 text-emerald-400" />
                      </motion.div>
                      <p className="text-base font-semibold text-white">Bienvenue dans la communauté !</p>
                      <p className="text-sm text-zinc-400">Vous recevrez bientôt nos premières nouvelles.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleNewsletterSubmit}
                      noValidate
                      className="max-w-md mx-auto"
                    >
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => {
                            setNewsletterEmail(e.target.value);
                            if (newsletterError) setNewsletterError("");
                          }}
                          placeholder="votre@email.com *"
                          required
                          aria-invalid={!!newsletterError}
                          className={`flex-1 px-5 py-3 rounded-full bg-white/6 border text-white placeholder:text-zinc-600 text-base focus:outline-none transition-colors ${
                            newsletterError
                              ? "border-red-500 focus:border-red-500"
                              : "border-white/12 focus:border-[var(--brand-primary)]/50"
                          }`}
                        />
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-full text-black font-bold text-base hover:opacity-90 transition-opacity whitespace-nowrap"
                          style={{ background: "var(--brand-gradient)" }}
                        >
                          Je rejoins
                        </button>
                      </div>
                      {newsletterError && (
                        <p className="text-red-400 text-base mt-2 text-left" role="alert">
                          {newsletterError}
                        </p>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>

                <p className="text-xs text-zinc-700 mt-4">
                  Pas de spam. Désabonnement en 1 clic.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ──────────────────────── FOOTER ──────────────────────── */}
        <footer className="border-t border-white/6 py-10 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
              {/* Brand */}
              <div>
                <div>
                  <span className="text-sm font-bold tracking-[0.12em] uppercase text-white">ARKE</span>
                  <span className="text-sm font-bold tracking-[0.12em]" style={{ color: "var(--brand-primary)" }}>
                    {" "}Studio
                  </span>
                </div>
                <p className="text-xs text-zinc-700 mt-1">Objets d&apos;artisanat de luxe</p>
              </div>

              {/* Link groups */}
              <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">Boutique</p>
                  <div className="flex flex-col gap-2">
                    {["Collections", "Nouveautés", "Bestsellers"].map((l) => (
                      <a key={l} href="#" className="text-zinc-500 hover:text-white transition-colors text-xs">
                        {l}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-3">Info</p>
                  <div className="flex flex-col gap-2">
                    {["Livraison", "Retours", "CGV", "Mentions légales"].map((l) => (
                      <a key={l} href="#" className="text-zinc-500 hover:text-white transition-colors text-xs">
                        {l}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-zinc-700">© 2025 ARKE Studio. Tous droits réservés.</p>
              <p className="text-xs text-zinc-800">Template by Antigravity Studio</p>
            </div>
          </div>
        </footer>

        {/* ──────────────────────── OVERLAYS ──────────────────────── */}

        {/* Cart panel */}
        <AnimatePresence>
          {cartOpen && (
            <CartPanel
              items={cart}
              onClose={() => setCartOpen(false)}
              onIncrement={incrementQty}
              onDecrement={decrementQty}
              onRemove={removeItem}
            />
          )}
        </AnimatePresence>

        {/* Quick-view modal */}
        <AnimatePresence>
          {quickViewProduct && (
            <QuickViewModal
              product={quickViewProduct}
              onClose={() => setQuickViewProduct(null)}
              onAddToCart={(p) => {
                addToCart(p);
              }}
              justAdded={justAddedId === quickViewProduct.id}
            />
          )}
        </AnimatePresence>

        {/* ──────────────────────── STICKY MOBILE CTA ──────────────────────── */}
        <StickyMobileCTA />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sticky mobile CTA (separate component to use its own scroll hook cleanly)
// ---------------------------------------------------------------------------
function StickyMobileCTA() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // Show after 400px scroll
  scrollY.on("change", (v) => setVisible(v > 400));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="fixed bottom-0 left-0 right-0 z-30 md:hidden px-4 pb-4 pt-2"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--bg-primary) 95%, transparent), transparent)",
          }}
        >
          <a
            href="#products"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-black font-bold text-sm shadow-xl"
            style={{ background: "var(--brand-gradient)" }}
          >
            Voir la collection <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
