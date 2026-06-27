"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0806",
        color: "#f0ece0",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "120px 40px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
            marginBottom: 60,
          }}
        >
          <ArrowLeft size={16} />
          Retour
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
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
              marginBottom: 40,
              lineHeight: 1.1,
            }}
          >
            Contact
          </h1>
          <div style={{ color: "rgba(240,236,224,0.7)", fontSize: 16, lineHeight: 1.8 }}>
            <p style={{ marginBottom: 24 }}>
              Prenez rendez-vous avec l'un de nos conseillers dans notre boutique parisienne ou 
              contactez-nous pour toute création sur mesure.
            </p>
            <p>
              Email : contact@maison-elara.fr<br />
              Téléphone : +33 1 23 45 67 89<br />
              Adresse : 15 Place Vendôme, 75001 Paris, France
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
