"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PRODUCTS = [
  {
    name: "Solitaire Éternité",
    subtitle: "La pureté absolue",
    material: "Or blanc 18k · Diamant 1.2ct F/VS1",
    price: "12 400 €",
    category: "Bagues",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
  },
  {
    name: "Collier Aube Dorée",
    subtitle: "Lumière sur la peau",
    material: "Or jaune 18k · Diamants 0.85ct total",
    price: "8 750 €",
    category: "Colliers",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
  },
  {
    name: "Bracelet Rivière",
    subtitle: "Un fleuve de lumière",
    material: "Platine 950 · Diamants 2.4ct",
    price: "18 200 €",
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
  },
  {
    name: "Boucles Célestes",
    subtitle: "La grâce à l'oreille",
    material: "Or rose 18k · Perles Akoya & Brillants",
    price: "5 900 €",
    category: "Boucles",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
  },
  {
    name: "Chevalière Crest",
    subtitle: "Héritage gravé",
    material: "Or jaune 22k · Gravure à la main",
    price: "3 200 €",
    category: "Chevalières",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
  },
  {
    name: "Parure Impériale",
    subtitle: "L'ensemble souverain",
    material: "Or blanc 18k · Saphirs & Diamants",
    price: "34 000 €",
    category: "Parures",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
  },
];

export default function CollectionsPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0a0806",
        color: "#f0ece0",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "120px 24px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Link 
          href="/templates/impact-20"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "rgba(212,175,107,0.7)",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            marginBottom: 40,
          }}
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 60 }}
        >
          <p
            style={{
              color: "#d4af6b",
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Maison Élara
          </p>
          <h1
            style={{
              color: "#f0ece0",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontStyle: "italic",
              fontWeight: 400,
              marginBottom: 24,
              lineHeight: 1.1,
            }}
          >
            La Collection Élence
          </h1>
          <p style={{ color: "rgba(240,236,224,0.7)", fontSize: 16, maxWidth: 640, lineHeight: 1.8 }}>
            Explorez nos créations d'exception façonnées en or 18 carats et platine, 
            ornées de diamants sélectionnés avec une rigueur absolue.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 32,
          }}
        >
          {PRODUCTS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(212,175,107,0.15)",
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/5", overflow: "hidden" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,8,6,0.9) 0%, transparent 60%)" }} />
                <span style={{ position: "absolute", bottom: 16, left: 20, color: "#d4af6b", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {item.category}
                </span>
              </div>

              <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 20, fontStyle: "italic", marginBottom: 6, color: "#f0ece0" }}>{item.name}</h3>
                  <p style={{ fontSize: 12, color: "rgba(240,236,224,0.5)", marginBottom: 12 }}>{item.subtitle}</p>
                  <p style={{ fontSize: 12, color: "rgba(212,175,107,0.8)", marginBottom: 20 }}>{item.material}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(212,175,107,0.1)" }}>
                  <span style={{ fontSize: 18, color: "#f0ece0", fontWeight: 600 }}>{item.price}</span>
                  <button style={{ background: "none", border: "1px solid #d4af6b", color: "#d4af6b", padding: "8px 16px", borderRadius: 4, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
                    Découvrir →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
