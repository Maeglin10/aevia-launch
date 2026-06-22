"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Check,
  Shield,
  Award,
  Heart,
  Package,
  MessageSquare,
  Link2,
  Camera,
  ChevronDown,
  Sparkles,
  RefreshCw,
  Gem,
  Users,
  Globe,
} from "lucide-react";

const C = {
  bg: "#0A0A0A",
  bgAlt: "#0F0F0F",
  bgCard: "#131313",
  bgCardHover: "#171717",
  gold: "#C9A84C",
  goldLight: "#E2C880",
  goldDim: "rgba(201,168,76,0.1)",
  goldBorder: "rgba(201,168,76,0.2)",
  goldGlow: "rgba(201,168,76,0.06)",
  cream: "#F5EDD8",
  text: "#EDE8DE",
  textMuted: "#7A736A",
  textFaint: "rgba(237,232,222,0.35)",
  border: "rgba(255,255,255,0.06)",
  borderGold: "rgba(201,168,76,0.15)",
  white: "#ffffff",
};

const FONT_HEADING = "'Cormorant Garamond', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const COLLECTIONS = [
  {
    name: "Éternité",
    category: "Bagues",
    desc: "Solitaires et alliances en platine 950, diamants GVS",
    from: "2 490 €",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80",
    tag: "Signature",
    pieces: 24,
  },
  {
    name: "Soleil d'Or",
    category: "Colliers",
    desc: "Pendentifs en or jaune 18K, pierres précieuses certifiées GIA",
    from: "890 €",
    img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    tag: "Bestseller",
    pieces: 18,
  },
  {
    name: "Lumière",
    category: "Boucles d'oreilles",
    desc: "Créoles et puces en or blanc 18K, diamants pavés",
    from: "680 €",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    tag: "Nouveau",
    pieces: 31,
  },
  {
    name: "Héritage",
    category: "Bracelets",
    desc: "Joncs et chaînes en or 18K, fermoirs prestige sertis",
    from: "1 290 €",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    tag: "",
    pieces: 15,
  },
  {
    name: "Sur-Mesure",
    category: "Bespoke",
    desc: "Créations uniques — votre vision, notre savoir-faire. Consultation gratuite.",
    from: "Sur devis",
    img: "https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=600&q=80",
    tag: "Exclusif",
    pieces: 0,
  },
  {
    name: "Prestige",
    category: "Parures",
    desc: "Ensembles complets collier + boucles + bracelet, pierres assorties",
    from: "4 900 €",
    img: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80",
    tag: "Édition limitée",
    pieces: 7,
  },
];

const STATS = [
  { value: "1947", label: "Fondée en", suffix: "" },
  { value: "18K+", label: "Pièces créées", suffix: "" },
  { value: "GIA", label: "Certifié", suffix: "" },
  { value: "67", label: "Pays livrés", suffix: "" },
];

const TESTIMONIALS = [
  {
    name: "Isabelle Moreau",
    location: "Paris, 8ème",
    stars: 5,
    text: "La bague Éternité que j'ai commandée pour nos 20 ans est au-delà de mes espérances. Le platine, le diamant — une pièce pour l'éternité. Le service était d'une discrétion et d'une élégance parfaites.",
    purchase: "Bague solitaire Éternité — Platine 950, 1.2ct GVS",
  },
  {
    name: "Cassandra Velt",
    location: "Genève, Suisse",
    stars: 5,
    text: "Aurum crée de la joaillerie comme on n'en fait plus. J'ai commandé un collier sur-mesure avec l'aigue-marine de ma grand-mère — le résultat est à couper le souffle. Vraie haute joaillerie.",
    purchase: "Création bespoke — Aigue-marine sur-mesure",
  },
  {
    name: "Laurent Descamps",
    location: "Bordeaux",
    stars: 5,
    text: "Après avoir cherché LA bague de fiançailles pendant 3 mois, Aurum Jewelry m'a accompagné de A à Z. Le solitaire est parfait, ma fiancée fond à chaque fois qu'elle le regarde.",
    purchase: "Bague de fiançailles — Or blanc 18K, diamant 0.85ct",
  },
  {
    name: "Mei-Ling Chan",
    location: "Hong Kong",
    stars: 5,
    text: "The craftsmanship at Aurum is unmatched in Europe. I ordered three pieces remotely — video consultation, certificate delivery, white-glove shipping. Flawless from start to finish.",
    purchase: "Parure complète Prestige — Saphirs ceylan",
  },
  {
    name: "Adriana Rossi",
    location: "Milan, Italie",
    stars: 5,
    text: "Il bracciale Héritage è semplicemente magnifico. L'oro 18K ha una profondità incredibile e i dettagli della serratura sono da musée. Aurum è la joaillerie française dans sa plus pure expression.",
    purchase: "Bracelet Héritage — Or jaune 18K",
  },
  {
    name: "Thomas & Sophie B.",
    location: "Lyon",
    stars: 5,
    text: "Nos alliances Aurum sont l'objet dont nous sommes le plus fiers. Gravure personnalisée, platine parfaitement assorti — 5 ans après le mariage elles sont aussi belles que le premier jour.",
    purchase: "Alliances sur-mesure — Platine 950 avec gravure",
  },
];

const CERTIFICATIONS = [
  {
    name: "GIA Certified",
    desc: "Gemological Institute of America",
    detail: "100% de nos diamants certifiés",
  },
  {
    name: "Kimberley Process",
    desc: "Diamants sans conflit",
    detail: "Traçabilité complète de la source",
  },
  {
    name: "Or 18K Poinçonné",
    desc: "Poinçon officiel français",
    detail: "Garantie Maison : 10 ans",
  },
  {
    name: "Platine 950",
    desc: "Alliage haute joaillerie",
    detail: "Le métal des solitaires prestige",
  },
];

const SERVICES = [
  {
    icon: Gem,
    title: "Gravure personnalisée",
    desc: "Vos initiales, une date, un message — gravure manuelle par nos artisans. Incluse sur tous les anneaux.",
  },
  {
    icon: RefreshCw,
    title: "Retouches & Entretien",
    desc: "Rhodiage, nettoyage, resserrage des sertis. Chaque pièce Aurum bénéficie d'un entretien gratuit la première année.",
  },
  {
    icon: Package,
    title: "Coffret prestige",
    desc: "Écrins en cuir pleine fleur, ruban soie, certificat authentique. Idéal pour offrir ou chérir.",
  },
  {
    icon: Shield,
    title: "Certificat & Assurance",
    desc: "Certificat GIA, évaluation pour assurance incluse. Documentation complète pour chaque pièce.",
  },
];

const FAQS = [
  {
    q: "Comment fonctionne la gravure personnalisée ?",
    a: "Tous nos anneaux (bagues, alliances, bracelets) peuvent être gravés manuellement par nos artisans. Lors de votre commande, vous indiquez le texte souhaité (jusqu'à 30 caractères). La gravure est incluse sans supplément. Délai : 5 jours ouvrés supplémentaires.",
  },
  {
    q: "Vos diamants sont-ils certifiés ?",
    a: "Absolument. 100% de nos diamants de 0.20ct et plus sont certifiés GIA (Gemological Institute of America) — le standard international le plus rigoureux. Chaque certificat accompagne physiquement votre bijou. Pour les diamants inférieurs à 0.20ct, nous fournissons notre certificat maison avec les caractéristiques 4C.",
  },
  {
    q: "Puis-je commander sur-mesure ?",
    a: "Oui — c'est même l'une de nos spécialités depuis 1947. Le processus bespoke commence par une consultation gratuite (en boutique Paris ou en visio). Nous travaillons ensemble sur le design, vous validez un dessin technique, puis nos artisans créent votre pièce unique en 4 à 8 semaines selon la complexité.",
  },
  {
    q: "Quelle est votre politique de retour ?",
    a: "Nous offrons 30 jours de retour pour les pièces de la collection, sous condition que le bijou soit non porté et accompagné de son certificat. Les créations sur-mesure et les pièces gravées ne sont pas éligibles au retour (sauf défaut de fabrication). Échange possible sous 60 jours.",
  },
  {
    q: "La livraison internationale est-elle sécurisée ?",
    a: "Nous expédions dans 67 pays avec DHL Express et Malca-Amit (transporteur spécialisé joaillerie de luxe). Chaque envoi est assuré pour sa valeur totale. Le délai est de 2-4 jours ouvrés en Europe, 5-7 jours hors Europe. La livraison en boutique Paris est disponible sous 24h.",
  },
  {
    q: "Proposez-vous des consultations en boutique ?",
    a: "Notre boutique est située au 24, rue de la Paix, Paris 75002, sur rendez-vous. Consultations disponibles du mardi au samedi de 10h à 19h. Pour les clients internationaux, nous proposons des consultations en visio avec présentation des pièces en direct. Prise de rendez-vous via notre site ou au +33 1 42 60 XX XX.",
  },
];

const ENGRAVING_FONTS = ["Élégante Script", "Classic Serif", "Fine Sans", "Art Nouveau"];

// ─── MARQUEE ─────────────────────────────────────────────────────────────────
function GoldMarquee() {
  const text =
    "BAGUES · COLLIERS · BRACELETS · BOUCLES D'OREILLES · SUR-MESURE · PLATINE 950 · OR 18K · DIAMANTS GIA · ";
  return (
    <div
      style={{
        overflow: "hidden",
        background: C.gold,
        padding: "11px 0",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        style={{
          display: "flex",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            style={{
              fontFamily: FONT_BODY,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.25em",
              color: C.bg,
              paddingRight: 0,
            }}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── STAT COUNTER ─────────────────────────────────────────────────────────────
function StatItem({
  value,
  label,
  suffix,
  delay = 0,
}: {
  value: string;
  label: string;
  suffix: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      style={{ textAlign: "center", padding: "60px 40px" }}
    >
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
          fontWeight: 300,
          color: C.gold,
          letterSpacing: 2,
          marginBottom: 10,
          fontStyle: "italic",
        }}
      >
        {value}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 11,
          color: C.textMuted,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Impact157Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCollection, setActiveCollection] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedFont, setSelectedFont] = useState(0);
  const [engravingText, setEngravingText] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filters = ["Tous", "Bagues", "Colliers", "Boucles d'oreilles", "Bracelets", "Bespoke"];
  const filteredCollections =
    activeFilter === "Tous"
      ? COLLECTIONS
      : COLLECTIONS.filter(
          (c) =>
            c.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
            (activeFilter === "Bespoke" && c.category === "Bespoke")
        );

  return (
    <div
      ref={containerRef}
      style={{
        background: C.bg,
        color: C.text,
        minHeight: "100vh",
        fontFamily: FONT_BODY,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 60px",
          height: 72,
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 26,
            letterSpacing: 6,
            color: C.gold,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          AURUM
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Collections", "Sur-Mesure", "Certifications", "Maison", "Contact"].map(
            (l) => (
              <a
                key={l}
                href="#contact"
                style={{
                  fontSize: 12,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: C.textMuted,
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = C.gold)
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = C.textMuted)
                }
              >
                {l}
              </a>
            )
          )}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span
            style={{ fontSize: 12, color: C.textMuted, letterSpacing: 1 }}
          >
            +33 1 42 60 XX XX
          </span>
          <motion.a
            href="#accueil"
            whileHover={{ background: C.goldLight }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "10px 24px",
              background: C.gold,
              color: C.bg,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            Rendez-vous
          </motion.a>
        </div>
      </nav>

      {/* ── MARQUEE ─────────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 72 }}>
        <GoldMarquee />
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "94vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left — photo */}
        <motion.div
          style={{
            scale: heroScale,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80) center/cover no-repeat`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, transparent 60%, rgba(10,10,10,0.8) 100%)",
            }}
          />
          {/* Gold line decoration */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: 80,
              left: 60,
              right: 60,
              height: 1,
              background: C.gold,
              transformOrigin: "left",
              opacity: 0.4,
            }}
          />
          {/* Cert badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7 }}
            style={{
              position: "absolute",
              bottom: 100,
              left: 60,
              background: "rgba(10,10,10,0.85)",
              border: `1px solid ${C.goldBorder}`,
              padding: "16px 24px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 9,
                letterSpacing: 3,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Certification GIA
            </div>
            <div
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 18,
                color: C.text,
                fontStyle: "italic",
              }}
            >
              Diamants sans conflit
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.textMuted,
                marginTop: 4,
              }}
            >
              Processus de Kimberley · 100% traçables
            </div>
          </motion.div>
        </motion.div>

        {/* Right — copy */}
        <motion.div
          style={{
            y: heroY,
            opacity: heroOpacity,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "120px 80px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 9,
                letterSpacing: 5,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 40,
                opacity: 0.8,
              }}
            >
              Haute Joaillerie · Paris · Depuis 1947
            </div>

            <h1
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(52px, 6vw, 88px)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: -1,
                color: C.text,
                marginBottom: 36,
                fontStyle: "italic",
              }}
            >
              L'art du bijou
              <br />
              <span style={{ color: C.gold }}>intemporel.</span>
            </h1>

            <p
              style={{
                fontSize: 16,
                color: C.textMuted,
                lineHeight: 1.9,
                maxWidth: 440,
                marginBottom: 52,
                fontWeight: 300,
              }}
            >
              Depuis 1947, Aurum Jewelry crée des bijoux qui traversent les
              générations. Diamants GIA certifiés, or 18K, platine 950 — chaque
              pièce est une œuvre unique taillée à Paris.
            </p>

            <div style={{ display: "flex", gap: 16, marginBottom: 48 }}>
              <motion.a
                href="#accueil"
                whileHover={{ background: C.goldLight }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 36px",
                  background: C.gold,
                  color: C.bg,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                Découvrir <ArrowRight size={14} />
              </motion.a>
              <motion.a
                href="#accueil"
                whileHover={{ borderColor: C.gold, color: C.gold }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px 32px",
                  background: "transparent",
                  color: C.text,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  textDecoration: "none",
                  border: `1px solid ${C.border}`,
                  transition: "all 0.2s",
                }}
              >
                Sur-Mesure
              </motion.a>
            </div>

            <div
              style={{
                display: "flex",
                gap: 40,
                fontSize: 12,
                color: C.textMuted,
              }}
            >
              {[
                "Livraison assurée",
                "Retours 30j",
                "Gravure offerte",
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    letterSpacing: 0.5,
                  }}
                >
                  <Check size={12} color={C.gold} />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bgAlt,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              borderRight: i < 3 ? `1px solid ${C.border}` : "none",
            }}
          >
            <StatItem
              value={s.value}
              label={s.label}
              suffix={s.suffix}
              delay={i * 0.12}
            />
          </div>
        ))}
      </section>

      {/* ── COLLECTIONS GRID ──────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 52,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONT_BODY,
                fontSize: 9,
                letterSpacing: 5,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 16,
                opacity: 0.8,
              }}
            >
              Nos Collections
            </div>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(40px, 4.5vw, 68px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: C.text,
                lineHeight: 1.1,
              }}
            >
              L'exception
              <br />
              à chaque pièce.
            </h2>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8 }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "8px 18px",
                  background:
                    activeFilter === f ? C.gold : "transparent",
                  color: activeFilter === f ? C.bg : C.textMuted,
                  border: `1px solid ${activeFilter === f ? C.gold : C.border}`,
                  fontSize: 11,
                  letterSpacing: 1,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: FONT_BODY,
                  textTransform: "uppercase",
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
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((col, i) => (
              <motion.div
                key={col.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                onHoverStart={() => setHoveredCard(i)}
                onHoverEnd={() => setHoveredCard(null)}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: C.bgCard,
                  border: `1px solid ${hoveredCard === i ? C.goldBorder : C.border}`,
                  transition: "border-color 0.3s",
                }}
              >
                {/* Image */}
                <div
                  style={{
                    height: 320,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <motion.div
                    animate={{ scale: hoveredCard === i ? 1.07 : 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `url(${col.img}) center/cover no-repeat`,
                    }}
                  />
                  {/* Overlay on hover */}
                  <motion.div
                    animate={{
                      opacity: hoveredCard === i ? 1 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 50%)",
                    }}
                  />

                  {/* Wishlist button */}
                  <motion.button
                    animate={{ opacity: hoveredCard === i ? 1 : 0, y: hoveredCard === i ? 0 : 8 }}
                    onClick={() =>
                      setWishlist((w) =>
                        w.includes(i)
                          ? w.filter((x) => x !== i)
                          : [...w, i]
                      )
                    }
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      width: 38,
                      height: 38,
                      background: "rgba(10,10,10,0.7)",
                      border: `1px solid ${C.goldBorder}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      backdropFilter: "blur(4px)",
                    }}
                  >
                    <Heart
                      size={16}
                      color={wishlist.includes(i) ? C.gold : C.textMuted}
                      fill={wishlist.includes(i) ? C.gold : "none"}
                    />
                  </motion.button>

                  {/* Tag */}
                  {col.tag && (
                    <div
                      style={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        background: C.gold,
                        color: C.bg,
                        padding: "4px 12px",
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {col.tag}
                    </div>
                  )}

                  {/* Quick add on hover */}
                  <AnimatePresence>
                    {hoveredCard === i && (
                      <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        style={{
                          position: "absolute",
                          bottom: 16,
                          left: 16,
                          right: 16,
                        }}
                      >
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          style={{
                            width: "100%",
                            padding: "12px",
                            background: C.gold,
                            color: C.bg,
                            border: "none",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            cursor: "pointer",
                          }}
                        >
                          Voir la collection
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Info */}
                <div style={{ padding: "24px" }}>
                  <div
                    style={{
                      fontSize: 9,
                      letterSpacing: 3,
                      color: C.gold,
                      textTransform: "uppercase",
                      marginBottom: 8,
                      fontFamily: FONT_BODY,
                      opacity: 0.8,
                    }}
                  >
                    {col.category}{" "}
                    {col.pieces > 0 && `· ${col.pieces} pièces`}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_HEADING,
                      fontSize: 22,
                      fontStyle: "italic",
                      color: C.text,
                      marginBottom: 8,
                    }}
                  >
                    {col.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: C.textMuted,
                      marginBottom: 20,
                      lineHeight: 1.6,
                    }}
                  >
                    {col.desc}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: FONT_HEADING,
                        fontSize: 20,
                        color: C.gold,
                        fontStyle: "italic",
                      }}
                    >
                      À partir de {col.from}
                    </div>
                    <motion.button
                      whileHover={{ color: C.gold }}
                      style={{
                        background: "none",
                        border: "none",
                        color: C.textMuted,
                        fontSize: 13,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontFamily: FONT_BODY,
                        transition: "color 0.15s",
                      }}
                    >
                      Explorer <ArrowRight size={13} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ── GRAVURE PERSONNALISÉE (Interactive) ───────────────────────────────── */}
      <section
        style={{
          background: C.bgAlt,
          padding: "120px 80px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          {/* Left — preview */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                position: "relative",
                background: C.bgCard,
                border: `1px solid ${C.goldBorder}`,
                padding: 48,
                textAlign: "center",
              }}
            >
              {/* Ring preview */}
              <div
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  border: `12px solid ${C.gold}`,
                  margin: "0 auto 32px",
                  position: "relative",
                  boxShadow: `0 0 40px rgba(201,168,76,0.15), inset 0 0 20px rgba(201,168,76,0.05)`,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: ENGRAVING_FONTS[selectedFont].includes("Script")
                      ? "'Cormorant Garamond', serif"
                      : FONT_BODY,
                    fontSize: engravingText.length > 8 ? 14 : 18,
                    fontStyle:
                      ENGRAVING_FONTS[selectedFont].includes("Serif") ||
                      ENGRAVING_FONTS[selectedFont].includes("Script")
                        ? "italic"
                        : "normal",
                    color: C.gold,
                    letterSpacing: 2,
                    padding: "0 20px",
                    wordBreak: "break-all",
                  }}
                >
                  {engravingText || "Votre texte"}
                </div>
              </div>

              <div
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 20,
                  fontStyle: "italic",
                  color: C.text,
                  marginBottom: 8,
                }}
              >
                Anneau Éternité — Platine 950
              </div>
              <div
                style={{ fontSize: 12, color: C.textMuted, letterSpacing: 1 }}
              >
                Gravure intérieure incluse
              </div>
            </div>
          </motion.div>

          {/* Right — controls */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 5,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 20,
                opacity: 0.8,
              }}
            >
              Service exclusif
            </div>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(36px, 4vw, 58px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: C.text,
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              Gravure
              <br />
              personnalisée.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: C.textMuted,
                lineHeight: 1.9,
                marginBottom: 40,
              }}
            >
              Chaque anneau Aurum peut être gravé manuellement par nos
              artisans. Initiales, date, message — jusqu'à 30 caractères,
              offert sur toutes les commandes.
            </p>

            {/* Text input */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Votre texte
              </div>
              <input
                value={engravingText}
                onChange={(e) =>
                  setEngravingText(e.target.value.slice(0, 30))
                }
                placeholder="Ex : M & A · 12.06.2024"
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  background: C.bgCard,
                  border: `1px solid ${C.goldBorder}`,
                  color: C.text,
                  fontSize: 16,
                  fontFamily: FONT_HEADING,
                  fontStyle: "italic",
                  outline: "none",
                  letterSpacing: 1,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  color: C.textMuted,
                  marginTop: 6,
                  textAlign: "right",
                }}
              >
                {engravingText.length}/30
              </div>
            </div>

            {/* Font selector */}
            <div style={{ marginBottom: 36 }}>
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 2,
                  color: C.textMuted,
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Style de gravure
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {ENGRAVING_FONTS.map((font, i) => (
                  <button
                    key={font}
                    onClick={() => setSelectedFont(i)}
                    style={{
                      padding: "8px 16px",
                      background:
                        selectedFont === i ? C.gold : "transparent",
                      color:
                        selectedFont === i ? C.bg : C.textMuted,
                      border: `1px solid ${selectedFont === i ? C.gold : C.border}`,
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      fontFamily: FONT_BODY,
                    }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ background: C.goldLight }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "100%",
                padding: "16px",
                background: C.gold,
                color: C.bg,
                border: "none",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.2s",
                fontFamily: FONT_BODY,
              }}
            >
              Commander avec gravure →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ────────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 5,
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 20,
              opacity: 0.8,
            }}
          >
            Garanties & Certifications
          </div>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(40px, 4.5vw, 68px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: C.text,
            }}
          >
            Notre engagement qualité.
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 2,
          }}
        >
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ background: C.bgCardHover }}
              style={{
                background: C.bgCard,
                padding: "48px 36px",
                textAlign: "center",
                border: `1px solid ${C.border}`,
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: `1px solid ${C.goldBorder}`,
                  background: C.goldDim,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                }}
              >
                <Award size={22} color={C.gold} />
              </div>
              <div
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 18,
                  fontStyle: "italic",
                  color: C.gold,
                  marginBottom: 10,
                }}
              >
                {cert.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.textMuted,
                  letterSpacing: 0.5,
                  marginBottom: 14,
                }}
              >
                {cert.desc}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.text,
                  opacity: 0.7,
                }}
              >
                {cert.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bgAlt,
          padding: "120px 80px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 72 }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 5,
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 20,
              opacity: 0.8,
            }}
          >
            Services inclus
          </div>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(40px, 4.5vw, 68px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: C.text,
            }}
          >
            L'expérience Aurum.
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
          }}
        >
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ borderColor: C.goldBorder, y: -4 }}
                style={{
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  padding: "40px 32px",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    border: `1px solid ${C.goldBorder}`,
                    background: C.goldDim,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                >
                  <Icon size={22} color={C.gold} />
                </div>
                <div
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 20,
                    fontStyle: "italic",
                    color: C.text,
                    marginBottom: 12,
                  }}
                >
                  {s.title}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: C.textMuted,
                    lineHeight: 1.8,
                  }}
                >
                  {s.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────────── */}
      <section style={{ padding: "120px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 5,
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 20,
              opacity: 0.8,
            }}
          >
            Témoignages
          </div>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(40px, 4.5vw, 68px)",
              fontWeight: 300,
              fontStyle: "italic",
              color: C.text,
            }}
          >
            Ce qu'ils en disent.
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ borderColor: C.goldBorder }}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                padding: "36px 32px",
                transition: "border-color 0.2s",
              }}
            >
              <div
                style={{ display: "flex", gap: 3, marginBottom: 24 }}
              >
                {Array(t.stars)
                  .fill(0)
                  .map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      color={C.gold}
                      fill={C.gold}
                    />
                  ))}
              </div>
              <p
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: 16,
                  fontStyle: "italic",
                  color: C.text,
                  lineHeight: 1.85,
                  marginBottom: 28,
                }}
              >
                "{t.text}"
              </p>
              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 4,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}
                >
                  {t.location}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.gold,
                    opacity: 0.7,
                    letterSpacing: 0.3,
                  }}
                >
                  {t.purchase}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: C.bgAlt,
          padding: "120px 80px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 72 }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 5,
                color: C.gold,
                textTransform: "uppercase",
                marginBottom: 20,
                opacity: 0.8,
              }}
            >
              FAQ
            </div>
            <h2
              style={{
                fontFamily: FONT_HEADING,
                fontSize: "clamp(40px, 4.5vw, 64px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: C.text,
              }}
            >
              Questions fréquentes.
            </h2>
          </motion.div>

          {FAQS.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              style={{ borderBottom: `1px solid ${C.border}` }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "24px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: 20,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: 18,
                    fontStyle: "italic",
                    color: C.text,
                  }}
                >
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  style={{
                    fontSize: 24,
                    color: C.gold,
                    minWidth: 24,
                    fontWeight: 300,
                    lineHeight: 1,
                  }}
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      style={{
                        paddingBottom: 24,
                        fontSize: 15,
                        color: C.textMuted,
                        lineHeight: 1.9,
                        fontFamily: FONT_BODY,
                      }}
                    >
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "160px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BG */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `url(https://images.unsplash.com/photo-1601121141461-9d6647bef0a1?w=1600&q=80) center/cover no-repeat`,
            opacity: 0.08,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ position: "relative" }}
        >
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 9,
              letterSpacing: 5,
              color: C.gold,
              textTransform: "uppercase",
              marginBottom: 32,
              opacity: 0.8,
            }}
          >
            24, Rue de la Paix · Paris 75002
          </div>
          <h2
            style={{
              fontFamily: FONT_HEADING,
              fontSize: "clamp(52px, 7vw, 100px)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: -1,
              color: C.text,
              lineHeight: 1.05,
              marginBottom: 40,
            }}
          >
            Votre bijou
            <br />
            <span style={{ color: C.gold }}>vous attend.</span>
          </h2>
          <p
            style={{
              fontSize: 17,
              color: C.textMuted,
              marginBottom: 56,
              maxWidth: 480,
              margin: "0 auto 56px",
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            Visitez-nous rue de la Paix ou consultez nos collections en ligne.
            Livraison assurée dans 67 pays, retours 30 jours.
          </p>
          <div
            style={{ display: "flex", gap: 16, justifyContent: "center" }}
          >
            <motion.a
              href="#contact"
              whileHover={{ background: C.goldLight }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 44px",
                background: C.gold,
                color: C.bg,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
            >
              Prendre rendez-vous <ArrowRight size={14} />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ borderColor: C.gold, color: C.gold }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 36px",
                background: "transparent",
                color: C.text,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 3,
                textTransform: "uppercase",
                textDecoration: "none",
                border: `1px solid ${C.border}`,
                transition: "all 0.2s",
              }}
            >
              Collections
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#060606",
          padding: "64px 80px 40px",
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 60,
            marginBottom: 60,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONT_HEADING,
                fontSize: 30,
                fontStyle: "italic",
                color: C.gold,
                fontWeight: 300,
                letterSpacing: 6,
                marginBottom: 20,
              }}
            >
              AURUM
            </div>
            <p
              style={{
                fontSize: 14,
                color: C.textMuted,
                lineHeight: 1.85,
                maxWidth: 280,
                marginBottom: 28,
              }}
            >
              Haute joaillerie parisienne depuis 1947. Diamants GIA, or 18K,
              platine 950. Chaque bijou est une promesse d'éternité.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[MessageSquare, Camera, Link2].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#contact"
                  whileHover={{ borderColor: C.goldBorder, color: C.gold }}
                  style={{
                    width: 36,
                    height: 36,
                    border: `1px solid ${C.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: C.textMuted,
                    transition: "all 0.15s",
                  }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Collections",
              links: ["Bagues", "Colliers", "Bracelets", "Boucles d'oreilles", "Sur-Mesure"],
            },
            {
              title: "Maison",
              links: ["Notre histoire", "Artisans", "Ateliers Paris", "Certifications", "Presse"],
            },
            {
              title: "Service",
              links: ["FAQ", "Livraison", "Retours", "Entretien", "Contact"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 4,
                  color: C.gold,
                  textTransform: "uppercase",
                  marginBottom: 24,
                  opacity: 0.7,
                }}
              >
                {col.title}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {col.links.map((l) => (
                  <a
                    key={l}
                    href="#accueil"
                    style={{
                      fontSize: 14,
                      color: C.textMuted,
                      textDecoration: "none",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      ((e.target as HTMLElement).style.color = C.gold)
                    }
                    onMouseLeave={(e) =>
                      ((e.target as HTMLElement).style.color = C.textMuted)
                    }
                  >
                    {l}
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
          }}
        >
          <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5 }}>
            © 2026 Aurum Jewelry SAS · 24, rue de la Paix · 75002 Paris
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, letterSpacing: 0.5 }}>
            Garantie maison 10 ans · Livraison assurée 67 pays
          </div>
        </div>
      </footer>
    </div>
  );
}
