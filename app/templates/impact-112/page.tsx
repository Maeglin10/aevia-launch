"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Camera,
  MessageSquare,
  Link2,
  Users2,
  MapPin,
  Phone,
  Mail,
  Plus,
  Minus,
} from "lucide-react";

/* ─── PALETTE ─────────────────────────────────────────────────── */
const C = {
  bg: "#FAF7F4",
  bgAlt: "#F2EDE7",
  bgDark: "#1E1209",
  text: "#2C1810",
  muted: "#8B6E5A",
  terracotta: "#9B4A28",
  terracottaLight: "#C46840",
  terracottaSoft: "rgba(155,74,40,0.09)",
  terracottaGlow: "rgba(155,74,40,0.18)",
  sand: "#E8D5C4",
  sandDark: "#D4B89A",
  border: "#E2D5C8",
  borderDark: "#C8B09A",
  cream: "#FDF9F6",
  white: "#FFFFFF",
};

const FONT = "'DM Sans', sans-serif";

/* ─── DATA ────────────────────────────────────────────────────── */
const NAV_LINKS = ["Boutique", "Collections", "Atelier", "Philosophie", "Contact"];

const PRODUCTS = [
  {
    id: "p1",
    name: "Bol Wabi-Sabi",
    cat: "Céramique",
    price: 68,
    material: "Grès de Bourgogne · Émaillage cendres de bois",
    dims: "Ø 14cm · H 7cm",
    stock: 3,
    badge: "Nouveau",
    desc: "Forme asymétrique née du hasard de la cuisson. Chaque pièce est unique. Parfait pour le café du matin ou les céréales en famille.",
    gradient: "linear-gradient(135deg, #D4845A 0%, #9B4A28 100%)",
  },
  {
    id: "p2",
    name: "Vase Colonne",
    cat: "Céramique",
    price: 128,
    material: "Porcelaine fine · Glaçure mate ivoire",
    dims: "Ø 8cm · H 28cm",
    stock: 5,
    badge: "",
    desc: "Silhouette élancée pour fleurs séchées ou branches. Finition satiné mat ivoire sur grès blanc.",
    gradient: "linear-gradient(135deg, #E8D5C4 0%, #C8A080 100%)",
  },
  {
    id: "p3",
    name: "Plat à Partager",
    cat: "Art de la table",
    price: 95,
    material: "Grès chamotté · Décor engobe blanc",
    dims: "35×22cm",
    stock: 2,
    badge: "Best-seller",
    desc: "Grand plat de service aux bords irréguliers. Passe au lave-vaisselle. Livré avec certificat d'authenticité.",
    gradient: "linear-gradient(135deg, #C8B09A 0%, #8B5A3A 100%)",
  },
  {
    id: "p4",
    name: "Tasse à Thé Minimaliste",
    cat: "Céramique",
    price: 42,
    material: "Porcelaine · Grès fin · Émaillage artisanal",
    dims: "Ø 8cm · H 9cm · 25cl",
    stock: 8,
    badge: "",
    desc: "Légère, confortable en main, résistante. Existe en cinq couleurs de glaçure. Sans poignée, dans la tradition japonaise.",
    gradient: "linear-gradient(135deg, #B8906A 0%, #7A4A2A 100%)",
  },
  {
    id: "p5",
    name: "Pot à Herbes Aromatiques",
    cat: "Jardin",
    price: 54,
    material: "Grès extérieur · Percé, drainage naturel",
    dims: "Ø 12cm · H 14cm",
    stock: 6,
    badge: "",
    desc: "Conçu pour les herbes en cuisine. Résistant au gel. Percé pour le drainage. Compatible intérieur-extérieur.",
    gradient: "linear-gradient(135deg, #A8784A 0%, #6B3A1E 100%)",
  },
  {
    id: "p6",
    name: "Carafe à Décanter",
    cat: "Art de la table",
    price: 145,
    material: "Grès de Limoges · Glaçure transparente",
    dims: "Ø 12cm · H 32cm · 1,2L",
    stock: 4,
    badge: "Collector",
    desc: "Forme inspirée des amphores antiques. Parfaite pour le vin, l'eau infusée ou les fleurs. Signée au fond.",
    gradient: "linear-gradient(135deg, #D4A070 0%, #9B5020 100%)",
  },
];

const COLLECTIONS = ["Tout voir", "Céramique", "Art de la table", "Jardin"];

const PROCESS_STEPS = [
  {
    n: "01",
    title: "La terre choisie",
    desc: "Nous sélectionnons des argiles françaises — grès de Bourgogne, porcelaine de Limoges — pour leurs qualités plastiques et leur réponse unique à la cuisson au bois.",
  },
  {
    n: "02",
    title: "Le tournage à la main",
    desc: "Chaque pièce est centrée, ouverte et montée sur le tour de potier par Julie Garnier, fondatrice de l'atelier. Aucun moule industriel. La main reste au cœur du geste.",
  },
  {
    n: "03",
    title: "La cuisson et l'aléatoire",
    desc: "Un premier séchage lent, puis deux cuissons : biscuit à 980°C, émail au bois à 1260°C. La flamme peint ce que les mains ne peuvent décider seules.",
  },
  {
    n: "04",
    title: "La sélection rigoureuse",
    desc: "Seules les pièces qui satisfont à notre exigence de forme, de toucher et d'intégrité structurelle quittent l'atelier. Les autres sont brisées — jamais vendues imparfaites.",
  },
];

const TESTIMONIALS = [
  {
    q: "La tasse à thé que j'ai reçue est d'une finesse incroyable. Je ne pensais pas qu'on pouvait expédier de la porcelaine aussi bien protégée. Elle est parfaite depuis six mois d'usage quotidien.",
    name: "Mathilde Rousseau",
    role: "Cliente, Lyon",
    stars: 5,
  },
  {
    q: "J'ai commandé le plat à partager pour un cadeau de mariage. Les mariés m'ont écrit une lettre de remerciements à part — la pièce était si belle qu'ils ont voulu savoir qui la faisait. C'est dire.",
    name: "Arnaud Lefèvre",
    role: "Client, Bordeaux",
    stars: 5,
  },
  {
    q: "Le vase colonne trône dans mon salon depuis quatre mois avec des branches séchées. Il s'impose sans dominer — exactement ce que je cherchais. Le service client était impeccable aussi.",
    name: "Sophie Marchand",
    role: "Cliente, Paris",
    stars: 5,
  },
  {
    q: "Impossible de choisir une seule pièce, j'ai commandé trois fois en deux mois. La régularité qualitative est impressionnante pour du fait-main. L'atelier a une vraie philosophie visible dans chaque objet.",
    name: "Pierre-Antoine Vidal",
    role: "Client, Nantes",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "Les pièces sont-elles faites à la main ?",
    a: "Oui, intégralement. Julie Garnier tourne chaque pièce sur le tour de potier, applique les engobes et émaux à la main, et supervise personnellement chaque cuisson. Aucun moule industriel n'est utilisé. Chaque pièce porte des légères variations — signatures de son caractère artisanal.",
  },
  {
    q: "Passent-elles au lave-vaisselle et au micro-ondes ?",
    a: "La majorité de nos pièces en grès et porcelaine passent au lave-vaisselle et au micro-ondes (sauf les pièces avec décor métallisé). Chaque fiche produit précise la compatibilité. En cas de doute, le lavage à la main en douceur prolonge la durée de vie des émaux.",
  },
  {
    q: "Combien de temps pour recevoir ma commande ?",
    a: "Les pièces en stock partent sous 48h ouvrées. Les pièces en commande sur mesure ou en attente de fournée demandent 3 à 6 semaines. Vous recevez un email à chaque étape : préparation, envoi, et numéro de suivi. Livraison soignée dans du papier de soie recyclé.",
  },
  {
    q: "Proposez-vous des commandes sur mesure ?",
    a: "Oui, pour les projets personnels (mariages, cadeaux d'entreprise, ensembles de table) et les projets professionnels (restaurants, hôtels, boutiques). Contactez-nous avec votre cahier des charges — délai de réponse 48h, devis gratuit sous une semaine.",
  },
  {
    q: "Comment retourner une pièce abîmée à la livraison ?",
    a: "Photographiez l'emballage et la pièce dans les 48h suivant la réception, puis envoyez-nous un email. Nous remplaçons ou remboursons sans discussion. Notre emballage est conçu pour résister aux chutes — les dommages sont rarissimes mais nous assumons quand cela arrive.",
  },
];

const PRICING = [
  {
    name: "Pièce unique",
    range: "42€ – 145€",
    desc: "Sélection de notre boutique permanente. Stock limité. Chaque pièce est signée et numérotée.",
    perks: [
      "Certificat d'authenticité",
      "Emballage cadeau offert",
      "Livraison soignée sous 48h",
      "Échange sous 14 jours",
    ],
    cta: "Parcourir la boutique",
    hot: false,
  },
  {
    name: "Ensemble de table",
    range: "À partir de 280€",
    desc: "Ensemble cohérent : 4 assiettes + 4 bols + 4 tasses. Réduction de 15% vs pièces seules.",
    perks: [
      "Choix de la glaçure",
      "-15% vs pièces individuelles",
      "Boîte cadeau premium",
      "Note manuscrite offerte",
      "Livraison offerte",
    ],
    cta: "Composer mon ensemble",
    hot: true,
  },
  {
    name: "Commande sur mesure",
    range: "Sur devis",
    desc: "Pièces uniques pour un anniversaire, un mariage ou un projet professionnel. Délai 3 à 6 semaines.",
    perks: [
      "Brief et devis gratuit",
      "Choix argile + glaçure",
      "Dimensions sur-mesure",
      "Signature ou gravure",
      "Suivi de fournée exclusif",
    ],
    cta: "Nous contacter",
    hot: false,
  },
];

/* ─── STAT COUNTER ───────────────────────────────────────────── */
function StatItem({ val, label }: { val: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
      style={{ textAlign: "center", flex: 1, minWidth: 120 }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: "clamp(2rem, 4vw, 2.8rem)",
          fontWeight: 800,
          color: C.terracotta,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {val}
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: C.muted,
          marginTop: 8,
          fontWeight: 500,
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ─── PRODUCT CARD ───────────────────────────────────────────── */
function ProductCard({ p, idx }: { p: (typeof PRODUCTS)[0]; idx: number }) {
  const [hovered, setHovered] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  function handleCart() {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.6 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.cream,
        border: `1px solid ${hovered ? C.borderDark : C.border}`,
        borderRadius: 6,
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 0.3s, box-shadow 0.3s",
        boxShadow: hovered
          ? "0 16px 48px rgba(155,74,40,0.12)"
          : "0 2px 12px rgba(44,24,16,0.04)",
        position: "relative",
      }}
    >
      {/* Badge */}
      {p.badge && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: C.terracotta,
            color: C.white,
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 2,
            zIndex: 2,
          }}
        >
          {p.badge}
        </div>
      )}

      {/* Image placeholder with gradient */}
      <div
        style={{
          width: "100%",
          height: 220,
          background: p.gradient,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Texture pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 60%)",
          }}
        />
        {/* Hover cart overlay */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: hovered ? "0%" : "100%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: "rgba(30,18,9,0.88)",
            backdropFilter: "blur(8px)",
            padding: "20px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: "0.8rem",
              color: C.sand,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {p.material}
          </span>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              handleCart();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: cartAdded ? "#4CAF50" : C.terracotta,
              color: C.white,
              border: "none",
              padding: "10px 18px",
              borderRadius: 3,
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: 700,
              fontFamily: FONT,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              transition: "background 0.3s",
            }}
          >
            {cartAdded ? (
              <>
                <Check size={14} />
                Ajouté
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                Ajouter
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px 20px 24px" }}>
        <div
          style={{
            fontSize: "0.65rem",
            fontWeight: 600,
            color: C.terracotta,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {p.cat}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: "1rem",
            fontWeight: 700,
            color: C.text,
            marginBottom: 6,
            letterSpacing: "-0.01em",
          }}
        >
          {p.name}
        </div>
        <div
          style={{
            fontSize: "0.77rem",
            color: C.muted,
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          {p.dims}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: "1.1rem",
              fontWeight: 800,
              color: C.text,
            }}
          >
            {p.price}€
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: p.stock <= 3 ? "#B45309" : C.muted,
              fontWeight: 500,
            }}
          >
            {p.stock <= 3 ? `Plus que ${p.stock}` : "En stock"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function ArtisanMinimalPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [activeFilter, setActiveFilter] = useState("Tout voir");
  const [activeTesti, setActiveTesti] = useState(0);
  const [testiDir, setTestiDir] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = activeFilter === "Tout voir"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.cat === activeFilter);

  function nextTesti() {
    setTestiDir(1);
    setActiveTesti((i) => (i + 1) % TESTIMONIALS.length);
  }
  function prevTesti() {
    setTestiDir(-1);
    setActiveTesti((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  return (
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        color: C.text,
        fontFamily: FONT,
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,800;1,9..40,300;1,9..40,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.sandDark}; }
      `}</style>

      {/* ── 1. NAVBAR ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(20px, 5vw, 64px)",
          height: 68,
          background: "rgba(250,247,244,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Potter wheel icon */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `1.5px solid ${C.terracotta}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: C.terracottaSoft,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: C.terracotta,
                  opacity: 0.6,
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: C.text,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Terre & Geste
              </div>
              <div
                style={{
                  fontSize: "0.52rem",
                  color: C.muted,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                Céramique artisanale · Bourgogne
              </div>
            </div>
          </div>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {NAV_LINKS.map((l) => (
            <a
              key={l}
              href="#"
              style={{
                color: C.muted,
                textDecoration: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                transition: "color 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.muted)}
            >
              {l}
            </a>
          ))}
          <button onClick={() => document.getElementById("boutique")?.scrollIntoView({behavior:"smooth"})}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: C.terracotta,
              color: C.white,
              padding: "9px 22px",
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "0.82rem",
              textDecoration: "none",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ShoppingCart size={14} />
            Boutique
          </button>
        </div>
      </motion.nav>

      {/* ── 2. HERO ───────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: 68,
          position: "relative",
          overflow: "hidden",
          background: C.bgAlt,
        }}
      >
        {/* Background texture circles */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(155,74,40,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "8%",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(155,74,40,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, position: "relative", zIndex: 2 }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "80px clamp(20px, 5vw, 80px)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            {/* Left text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: C.terracottaSoft,
                  border: `1px solid rgba(155,74,40,0.2)`,
                  borderRadius: 100,
                  padding: "6px 16px",
                  marginBottom: 32,
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.terracotta,
                  }}
                />
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    color: C.terracotta,
                    letterSpacing: "0.06em",
                  }}
                >
                  Atelier fondé en 2016 · Beaune, Bourgogne
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.04em",
                  color: C.text,
                  marginBottom: 28,
                }}
              >
                La main,
                <br />
                la flamme,
                <br />
                <span style={{ color: C.terracotta }}>l'objet.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7 }}
                style={{
                  fontSize: "1rem",
                  color: C.muted,
                  lineHeight: 1.75,
                  maxWidth: 420,
                  marginBottom: 44,
                }}
              >
                Céramiques artisanales tournées à la main en Bourgogne. Grès,
                porcelaine, émaux naturels. Chaque pièce est unique et livrée
                avec son certificat d'authenticité.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
              >
                <button onClick={() => document.getElementById("boutique")?.scrollIntoView({behavior:"smooth"})}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 8px 32px rgba(155,74,40,0.25)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    background: C.terracotta,
                    color: C.white,
                    padding: "14px 30px",
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    letterSpacing: "0.04em",
                  }}
                >
                  <ShoppingCart size={16} />
                  Découvrir la boutique
                </button>
                <button onClick={() => document.getElementById("atelier")?.scrollIntoView({behavior:"smooth"})}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    border: `1.5px solid ${C.borderDark}`,
                    color: C.text,
                    padding: "14px 28px",
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    textDecoration: "none",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      C.terracotta)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor =
                      C.borderDark)
                  }
                >
                  Notre atelier
                  <ArrowRight size={15} />
                </button>
              </motion.div>
            </div>

            {/* Right — visual ceramic showcase */}
            <div
              style={{ position: "relative", display: "flex", justifyContent: "center" }}
            >
              {/* Main large circle — ceramic texture */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #C8784A 0%, #7A3818 50%, #4A2010 100%)",
                  boxShadow: "0 32px 80px rgba(155,74,40,0.30), 0 4px 16px rgba(44,24,16,0.15)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Inner texture ring */}
                <div
                  style={{
                    position: "absolute",
                    top: "15%",
                    left: "15%",
                    right: "15%",
                    bottom: "15%",
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.1)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "30%",
                    right: "30%",
                    bottom: "30%",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                {/* Center dot — potter wheel metaphor */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                  }}
                />
                {/* Highlight */}
                <div
                  style={{
                    position: "absolute",
                    top: "12%",
                    left: "18%",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.08)",
                    filter: "blur(16px)",
                  }}
                />
              </motion.div>

              {/* Floating info cards */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "8%",
                  right: "-2%",
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "14px 18px",
                  boxShadow: "0 8px 32px rgba(44,24,16,0.10)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: C.muted,
                    marginBottom: 4,
                    letterSpacing: "0.06em",
                  }}
                >
                  Cuisson bois
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: C.terracotta,
                  }}
                >
                  1260°C
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "-4%",
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "14px 18px",
                  boxShadow: "0 8px 32px rgba(44,24,16,0.10)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.65rem",
                    color: C.muted,
                    marginBottom: 4,
                    letterSpacing: "0.06em",
                  }}
                >
                  Pièces disponibles
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: C.text,
                  }}
                >
                  28 pièces
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── 3. STATS ─────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bgDark,
          padding: "60px clamp(20px, 5vw, 64px)",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          {[
            { val: "2016", label: "Fondé à Beaune" },
            { val: "480+", label: "Pièces vendues" },
            { val: "100%", label: "Fait main" },
            { val: "4.9★", label: "Note moyenne" },
          ].map((s) => (
            <StatItem key={s.label} val={s.val} label={s.label} />
          ))}
        </div>
      </section>

      {/* ── 4. BOUTIQUE — Product grid ───────────────────────────── */}
      <section
        id="boutique"
        style={{ padding: "100px 0", background: C.bg }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 48 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.terracotta,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Boutique permanente
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: 32,
              }}
            >
              Pièces disponibles
            </h2>

            {/* Filters */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COLLECTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    background: activeFilter === f ? C.terracotta : "transparent",
                    color: activeFilter === f ? C.white : C.muted,
                    border: `1px solid ${activeFilter === f ? C.terracotta : C.border}`,
                    padding: "8px 18px",
                    borderRadius: 100,
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    fontFamily: FONT,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            <AnimatePresence>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} p={p} idx={i} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── 5. COLLECTION CAPSULE BANNER ─────────────────────────── */}
      <section
        style={{
          background: C.terracotta,
          padding: "80px clamp(20px, 5vw, 64px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-5%",
            top: "50%",
            transform: "translateY(-50%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.65)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Collection capsule · Printemps 2026
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(1.8rem, 4vw, 3rem)",
                fontWeight: 800,
                color: C.white,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              "Forêt de brume"
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
                maxWidth: 440,
              }}
            >
              8 pièces inspirées des sous-bois bourguignons au lever du soleil.
              Émaux vert céladon, brun fumé, blanc cassé. Production limitée à 40 exemplaires numérotés.
            </p>
          </motion.div>

          <button onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}
            whileHover={{ scale: 1.04, background: C.white, color: C.terracotta }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255,255,255,0.15)",
              border: `1.5px solid rgba(255,255,255,0.4)`,
              color: C.white,
              padding: "16px 32px",
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "0.85rem",
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "all 0.3s",
              whiteSpace: "nowrap",
            }}
          >
            Rejoindre la liste d'attente
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 6. PROCESSUS ATELIER ──────────────────────────────────── */}
      <section
        id="atelier"
        style={{
          background: C.bgAlt,
          padding: "100px 0",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 64 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.terracotta,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Notre méthode
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              De la terre à l'objet,<br />
              <span style={{ color: C.terracotta }}>quatre étapes</span>
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 32,
            }}
          >
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                style={{
                  background: C.cream,
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  padding: "36px 28px",
                  position: "relative",
                }}
              >
                {/* Step number */}
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    color: C.terracottaSoft,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    marginBottom: 20,
                    userSelect: "none",
                  }}
                >
                  {step.n}
                </div>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: C.terracotta,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Étape {step.n}
                </div>
                <h3
                  style={{
                    fontFamily: FONT,
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 12,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: C.muted,
                    lineHeight: 1.7,
                  }}
                >
                  {step.desc}
                </p>

                {/* Connector line (not on last) */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: -17,
                      width: 32,
                      height: 1,
                      background: C.terracottaSoft,
                      zIndex: 1,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ──────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "100px 0",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: "center", marginBottom: 64 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.terracotta,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Témoignages clients
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Ce qu'ils disent
            </h2>
          </motion.div>

          {/* Testimonial card */}
          <div
            style={{
              background: C.cream,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "52px 56px",
              boxShadow: "0 4px 32px rgba(44,24,16,0.06)",
              position: "relative",
            }}
          >
            {/* Terracotta accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 4,
                height: "100%",
                background: C.terracotta,
                borderRadius: "8px 0 0 8px",
              }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTesti}
                initial={{ opacity: 0, x: testiDir * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: testiDir * -30 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    marginBottom: 24,
                  }}
                >
                  {Array.from({ length: TESTIMONIALS[activeTesti].stars }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={C.terracotta}
                        color={C.terracotta}
                      />
                    )
                  )}
                </div>

                <blockquote
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
                    lineHeight: 1.75,
                    color: C.text,
                    fontWeight: 400,
                    marginBottom: 32,
                  }}
                >
                  "{TESTIMONIALS[activeTesti].q}"
                </blockquote>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: C.terracottaSoft,
                      border: `1px solid rgba(155,74,40,0.2)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      fontWeight: 800,
                      color: C.terracotta,
                      flexShrink: 0,
                    }}
                  >
                    {TESTIMONIALS[activeTesti].name.charAt(0)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: C.text,
                      }}
                    >
                      {TESTIMONIALS[activeTesti].name}
                    </div>
                    <div
                      style={{ fontSize: "0.77rem", color: C.muted, marginTop: 2 }}
                    >
                      {TESTIMONIALS[activeTesti].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
              marginTop: 32,
            }}
          >
            <button
              onClick={prevTesti}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: C.cream,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: C.muted,
                transition: "border-color 0.2s, color 0.2s",
                boxShadow: "0 2px 8px rgba(44,24,16,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  C.terracotta;
                (e.currentTarget as HTMLElement).style.color = C.terracotta;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = C.border;
                (e.currentTarget as HTMLElement).style.color = C.muted;
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTestiDir(i > activeTesti ? 1 : -1);
                    setActiveTesti(i);
                  }}
                  style={{
                    width: i === activeTesti ? 28 : 8,
                    height: 8,
                    borderRadius: 100,
                    background: i === activeTesti ? C.terracotta : C.sandDark,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <button
              onClick={nextTesti}
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: C.cream,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: C.muted,
                transition: "border-color 0.2s, color 0.2s",
                boxShadow: "0 2px 8px rgba(44,24,16,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  C.terracotta;
                (e.currentTarget as HTMLElement).style.color = C.terracotta;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = C.border;
                (e.currentTarget as HTMLElement).style.color = C.muted;
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 8. PRICING ──────────────────────────────────────────── */}
      <section
        style={{
          background: C.bgAlt,
          padding: "100px 0",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.terracotta,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Comment acheter
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Trouvez la formule<br />qui vous convient
            </h2>
          </motion.div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
              alignItems: "start",
            }}
          >
            {PRICING.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{ y: -4 }}
                style={{
                  background: plan.hot ? C.terracottaSoft : C.cream,
                  border: `1px solid ${plan.hot ? "rgba(155,74,40,0.3)" : C.border}`,
                  borderRadius: 6,
                  padding: "36px 32px",
                  position: "relative",
                  transform: plan.hot ? "scale(1.02)" : "scale(1)",
                  boxShadow: plan.hot
                    ? "0 8px 32px rgba(155,74,40,0.12)"
                    : "0 2px 12px rgba(44,24,16,0.04)",
                }}
              >
                {plan.hot && (
                  <div
                    style={{
                      position: "absolute",
                      top: -13,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: C.terracotta,
                      color: C.white,
                      padding: "4px 18px",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      borderRadius: 2,
                    }}
                  >
                    Plus populaire
                  </div>
                )}

                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: plan.hot ? C.terracotta : C.muted,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 12,
                  }}
                >
                  {plan.name}
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    color: C.text,
                    marginBottom: 8,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {plan.range}
                </div>
                <p
                  style={{
                    fontSize: "0.83rem",
                    color: C.muted,
                    marginBottom: 28,
                    lineHeight: 1.65,
                  }}
                >
                  {plan.desc}
                </p>

                <div
                  style={{
                    borderTop: `1px solid ${C.border}`,
                    paddingTop: 24,
                    marginBottom: 28,
                    display: "flex",
                    flexDirection: "column",
                    gap: 11,
                  }}
                >
                  {plan.perks.map((p) => (
                    <div
                      key={p}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <Check
                        size={14}
                        color={C.terracotta}
                        style={{ flexShrink: 0, marginTop: 2 }}
                      />
                      <span
                        style={{
                          fontSize: "0.83rem",
                          color: C.text,
                          lineHeight: 1.5,
                        }}
                      >
                        {p}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    width: "100%",
                    padding: 13,
                    borderRadius: 3,
                    border: plan.hot ? "none" : `1px solid ${C.borderDark}`,
                    background: plan.hot ? C.terracotta : "transparent",
                    color: plan.hot ? C.white : C.text,
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    fontFamily: FONT,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    transition: "background 0.2s",
                  }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bg,
          padding: "100px 0",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 64px)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{ marginBottom: 52 }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.terracotta,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Questions fréquentes
            </div>
            <h2
              style={{
                fontFamily: FONT,
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Tout ce que vous<br />voulez savoir
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                style={{
                  borderBottom: `1px solid ${C.border}`,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "22px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    gap: 20,
                    fontFamily: FONT,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: openFaq === i ? C.text : "rgba(44,24,16,0.8)",
                      lineHeight: 1.4,
                      transition: "color 0.2s",
                    }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0 }}
                  >
                    <Plus
                      size={20}
                      color={openFaq === i ? C.terracotta : C.muted}
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          paddingBottom: 24,
                          color: C.muted,
                          fontSize: "0.9rem",
                          lineHeight: 1.8,
                        }}
                      >
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. CTA CONTACT ────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          background: C.bgDark,
          padding: "120px 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: C.terracottaGlow,
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            padding: "0 clamp(20px, 5vw, 64px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: C.terracottaLight,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Une question ? Un projet ?
            </div>

            <h2
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: "clamp(2.8rem, 7vw, 5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                marginBottom: 24,
                color: C.white,
              }}
            >
              Parlons de<br />
              <span style={{ color: C.terracottaLight }}>votre pièce</span>
            </h2>

            <p
              style={{
                fontSize: "1rem",
                color: "rgba(250,247,244,0.6)",
                lineHeight: 1.75,
                marginBottom: 48,
                maxWidth: 440,
                margin: "0 auto 48px",
              }}
            >
              Commandes sur mesure, ensembles de table, cadeaux d'entreprise.
              Julie vous répond personnellement sous 48h.
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <motion.a
                href="mailto:julie@terreetgeste.fr"
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 40px rgba(155,74,40,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: C.terracotta,
                  color: C.white,
                  padding: "16px 36px",
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                <Mail size={15} />
                Écrire à Julie
              </button>
              <button onClick={() => document.getElementById("boutique")?.scrollIntoView({behavior:"smooth"})}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  border: "1px solid rgba(250,247,244,0.2)",
                  color: C.white,
                  padding: "16px 30px",
                  borderRadius: 3,
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  letterSpacing: "0.04em",
                  transition: "border-color 0.2s",
                }}
              >
                Voir la boutique
              </button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                marginTop: 48,
                flexWrap: "wrap",
              }}
            >
              {[
                { Icon: MapPin, t: "Atelier · Beaune, Bourgogne" },
                { Icon: Phone, t: "+33 3 80 XX XX XX" },
                { Icon: Mail, t: "julie@terreetgeste.fr" },
              ].map(({ Icon, t }) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: "0.78rem",
                    color: "rgba(250,247,244,0.5)",
                  }}
                >
                  <Icon size={13} color={C.terracottaLight} />
                  {t}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 11. FOOTER ──────────────────────────────────────────── */}
      <footer
        style={{
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          padding: "64px clamp(20px, 5vw, 64px) 44px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 48,
              marginBottom: 56,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: `1.5px solid ${C.terracotta}`,
                    background: C.terracottaSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: C.terracotta,
                      opacity: 0.6,
                    }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: "0.95rem",
                      color: C.text,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Terre & Geste
                  </div>
                  <div
                    style={{
                      fontSize: "0.5rem",
                      color: C.muted,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    }}
                  >
                    Céramique artisanale
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.83rem",
                  color: C.muted,
                  lineHeight: 1.7,
                  maxWidth: 260,
                  marginBottom: 24,
                }}
              >
                Atelier de céramique artisanale à Beaune. Tournée à la main, cuite au bois. Fondé en 2016 par Julie Garnier.
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                {[Camera, MessageSquare, Link2, Users2].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 3,
                      border: `1px solid ${C.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: C.muted,
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        C.terracotta;
                      (e.currentTarget as HTMLElement).style.color =
                        C.terracotta;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        C.border;
                      (e.currentTarget as HTMLElement).style.color = C.muted;
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Boutique",
                links: ["Céramique", "Art de la table", "Jardin", "Collector"],
              },
              {
                title: "Atelier",
                links: ["Notre méthode", "Julie Garnier", "Visits atelier", "Presse"],
              },
              {
                title: "Service",
                links: ["Commande sur mesure", "Livraison & retour", "FAQ", "Contact"],
              },
            ].map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: C.terracotta,
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 18,
                  }}
                >
                  {col.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {col.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      style={{
                        fontSize: "0.83rem",
                        color: C.muted,
                        textDecoration: "none",
                        cursor: "pointer",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = C.text)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = C.muted)
                      }
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: 28,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ fontSize: "0.73rem", color: C.muted }}>
              © 2026 Terre & Geste · Atelier de céramique · Beaune, Bourgogne · Micro-entreprise
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {["Mentions légales", "Confidentialité", "CGV"].map((link) => (
                <a
                  key={link}
                  href="#"
                  style={{
                    fontSize: "0.73rem",
                    color: C.muted,
                    textDecoration: "none",
                    cursor: "pointer",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = C.text)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = C.muted)
                  }
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
