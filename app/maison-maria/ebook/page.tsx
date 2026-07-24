"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";

const C = {
  bg: "#fdfaf5",
  blush: "#f5e6da",
  dark: "#1a1412",
  rose: "#c4847a",
  roseLight: "#e8b4ad",
  roseDark: "#9d5f56",
  ivory: "#f7f2ea",
  ivoryDark: "#ede4d6",
  text: "#2d2220",
  textMuted: "#8a7570",
  font: "'Cormorant Garamond', Georgia, serif",
  fontSans: "'DM Sans', system-ui, sans-serif",
};

const EBOOK_PRICE = "22";
const EBOOK_TITLE = "Débuter en Extensions de Cils";
const EBOOK_SUBTITLE = "Le guide simple, professionnel et rentable pour réussir tes premières poses — matériel, hygiène, erreurs à éviter et premières clientes.";
const PURCHASE_LINK = "#achat";
// Fallback SumUp link — to be replaced with Maria's actual SumUp payment link
const SUMUP_LINK = process.env.NEXT_PUBLIC_SUMUP_LINK ?? "";

const CHAPTERS = [
  {
    num: "01",
    title: "Le matériel de base à avoir absolument",
    pages: "",
    topics: [
      "Pinces, colle, extensions : ce qu'il faut vraiment sans se ruiner",
      "Patchs, brosse goupillon, pierre de jade",
      "Petit conseil : investir progressivement, pas tout d'un coup",
    ],
  },
  {
    num: "02",
    title: "Préparation de la cliente & hygiène",
    pages: "",
    topics: [
      "La routine complète avant chaque pose",
      "Nettoyage, dégraissage, isolation des cils du bas",
      "Pourquoi 50 % d'une bonne pose se joue avant de commencer",
    ],
  },
  {
    num: "03",
    title: "Les erreurs fréquentes à éviter",
    pages: "",
    topics: [
      "Les 7 erreurs les plus courantes chez les débutantes",
      "Pourquoi elles arrivent et comment les corriger",
      "Les conseils d'entretien à toujours transmettre",
    ],
  },
  {
    num: "04",
    title: "Comment progresser rapidement",
    pages: "",
    topics: [
      "Pratique, posture, gestion du temps",
      "Se former en continu et rester inspirée",
    ],
  },
  {
    num: "Bonus",
    title: "Les habitudes des vraies professionnelles",
    pages: "",
    topics: [
      "Présentation, communication, régularité",
      "Ce qui fait la différence entre une pro et une passionnée désorganisée",
    ],
  },
  {
    num: "Bonus",
    title: "Comment trouver tes premières clientes",
    pages: "",
    topics: [
      "Entourage, modèles intelligents, Instagram",
      "Photos, avis clients, bouche-à-oreille",
      "Pourquoi ne pas brader ses prix dès le début",
    ],
  },
  {
    num: "Bonus",
    title: "Comment fidéliser tes clientes",
    pages: "",
    topics: [
      "Première impression, ponctualité, expérience client",
      "Suivi après le rendez-vous, image cohérente",
      "Gérer les problèmes avec classe",
    ],
  },
];

const FAQS = [
  {
    q: "Je suis débutante, ce guide est-il fait pour moi ?",
    a: "Oui, c'est exactement pour ça qu'il a été écrit. Le guide part de zéro (matériel, hygiène, sécurité) et t'accompagne jusqu'à tes premières clientes.",
  },
  {
    q: "Le guide remplace-t-il une formation présentielle ?",
    a: "Non — et ce n'est pas son objectif. Une formation présentielle reste indispensable pour pratiquer sur un vrai modèle. Ce guide est un support clair pour bien démarrer, éviter les erreurs qui coûtent cher et prendre confiance.",
  },
  {
    q: "Sous quelle forme est livré l'e-book ?",
    a: "En PDF, accessible sur ordinateur, tablette et smartphone. Un lien de téléchargement vous est envoyé par e-mail peu après votre paiement.",
  },
  {
    q: "Puis-je partager ou revendre ce guide ?",
    a: "Non. L'achat vous confère une licence personnelle, non transférable. Toute reproduction ou revente, même partielle, est une violation du droit d'auteur. Consultez nos CGV pour les détails.",
  },
  {
    q: "Et si je ne suis pas satisfaite ?",
    a: "Contactez-nous à contact@maison-maria.fr dans les 7 jours suivant l'achat si vous rencontrez un problème technique. Pour les raisons de fond, nous ne pratiquons pas le remboursement sur les produits numériques (contenu immédiatement accessible), conformément à nos CGV.",
  },
];

function useFonts() {
  useEffect(() => {
    const id = "fonts-ebook-mm";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');`;
    document.head.appendChild(s);
  }, []);
}

function TextReveal({ children, delay = 0, style: ext }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", ...ext }}>
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 0.85, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function MagneticButton({ children, style: ext, onClick, href }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void; href?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 25 });
  const sy = useSpring(y, { stiffness: 300, damping: 25 });
  const ref = useRef<HTMLButtonElement>(null);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  }, [x, y]);
  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);
  return (
    <motion.button
      ref={ref}
      style={{ ...ext, x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.ivoryDark}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "22px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}
      >
        <span style={{ fontFamily: C.font, fontSize: 20, fontWeight: 500, color: C.dark, lineHeight: 1.3 }}>{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: 22, color: C.rose, flexShrink: 0 }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontFamily: C.fontSans, fontSize: 15, color: C.textMuted, lineHeight: 1.8, paddingBottom: 22 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EbookPage() {
  useFonts();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = { scrollY: useMotionValue(0) };

  useEffect(() => {
    const unsub = window.addEventListener("scroll", () => setScrolled(window.scrollY > 60));
    return () => window.removeEventListener("scroll", () => {});
  }, []);

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleBuy = () => {
    const el = document.getElementById("achat");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStripeCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const { url, error } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        console.error("Stripe checkout error:", error);
        setCheckoutLoading(false);
      }
    } catch {
      setCheckoutLoading(false);
    }
  };

  return (
    <div style={{ background: C.bg, color: C.dark, fontFamily: C.fontSans, overflowX: "hidden" }}>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, padding: "0 clamp(20px,5vw,80px)", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(253,250,245,0.95)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", borderBottom: scrolled ? `1px solid ${C.ivoryDark}` : "none", transition: "all 0.4s ease" }}>
        <Link href="/maison-maria" style={{ fontFamily: C.font, fontSize: 22, color: C.dark, textDecoration: "none" }}>
          Maison Maria
        </Link>
        <button
          onClick={handleBuy}
          style={{ background: C.rose, color: "#fff", border: "none", padding: "10px 24px", fontFamily: C.fontSans, fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", borderRadius: 1 }}
        >
          Obtenir le guide — {EBOOK_PRICE}€
        </button>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64, position: "relative", overflow: "hidden" }}>
        {/* Background gradient */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 60% at 70% 50%, ${C.blush} 0%, ${C.bg} 60%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px clamp(24px,6vw,80px)", display: "grid", gridTemplateColumns: "1fr auto", gap: 64, alignItems: "center", position: "relative", zIndex: 2, width: "100%" }}>
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.blush, border: `1px solid ${C.roseLight}`, borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.rose, display: "inline-block" }} />
              <span style={{ fontFamily: C.fontSans, fontSize: 11, color: C.roseDark, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Guide professionnel · Spécial débutantes
              </span>
            </motion.div>

            <TextReveal>
              <h1 style={{ fontFamily: C.font, fontSize: "clamp(40px,6vw,78px)", fontWeight: 400, color: C.dark, lineHeight: 1.05, marginBottom: 4 }}>
                {EBOOK_TITLE}
              </h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p style={{ fontFamily: C.fontSans, fontSize: 15, color: C.textMuted, lineHeight: 1.75, maxWidth: 580, marginTop: 20, marginBottom: 36 }}>
                {EBOOK_SUBTITLE}
              </p>
            </TextReveal>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: "flex", gap: 40, marginBottom: 44, flexWrap: "wrap" }}
            >
              {[
                { val: "34 pages", label: "claires et concrètes" },
                { val: "4 parties", label: "matériel à premières clientes" },
                { val: "3 bonus", label: "chapitres inclus" },
                { val: "PDF", label: "livré par e-mail" },
              ].map((s) => (
                <div key={s.val}>
                  <div style={{ fontFamily: C.font, fontSize: 30, fontWeight: 500, color: C.dark, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 10, color: C.textMuted, marginTop: 4, letterSpacing: "0.05em" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Price + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                <span style={{ fontFamily: C.font, fontSize: 50, fontWeight: 400, color: C.dark }}>{EBOOK_PRICE}€</span>
              </div>
              <MagneticButton
                onClick={handleBuy}
                style={{ background: C.dark, color: "#fff", border: "none", padding: "18px 48px", fontFamily: C.fontSans, fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", borderRadius: 1 }}
              >
                Télécharger le guide
              </MagneticButton>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ fontFamily: C.fontSans, fontSize: 12, color: C.textMuted, marginTop: 14 }}>
              ✓ Livraison immédiate par e-mail · ✓ PDF haute résolution · ✓ Mises à jour incluses
            </motion.p>
          </div>

          {/* Ebook mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ flexShrink: 0 }}
            className="ebook-mockup"
          >
            <div style={{ width: 340, height: 450, background: `linear-gradient(135deg, ${C.dark} 0%, #2d1f1c 100%)`, borderRadius: 8, boxShadow: `0 40px 80px rgba(26,20,18,0.35), 0 0 0 1px rgba(255,255,255,0.05)`, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 40 }}>
              {/* Decorative */}
              <div style={{ position: "absolute", top: 36, left: 36, right: 36, height: 2, background: `linear-gradient(90deg, ${C.rose}, ${C.roseLight})` }} />
              <div style={{ position: "absolute", top: 74, left: 36, right: 36 }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.roseLight, marginBottom: 14, fontWeight: 500 }}>par Zoé Maria</div>
                <div style={{ fontFamily: C.font, fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 26 }}>Lash Artist · Maison Maria</div>
                <div style={{ fontFamily: C.font, fontSize: 32, fontWeight: 400, color: "#fff", lineHeight: 1.25 }}>Débuter en<br /><em style={{ color: C.roseLight }}>Extensions</em><br />de Cils</div>
              </div>
              <div style={{ position: "absolute", bottom: 36, left: 36, right: 36, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: C.fontSans, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>34 pages</span>
                <span style={{ fontFamily: C.fontSans, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>PDF</span>
              </div>
              {/* Rose circle accent */}
              <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${C.rose}22 0%, transparent 70%)` }} />
            </div>
          </motion.div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .ebook-mockup { display: none !important; }
          }
        `}</style>
      </section>

      {/* Social proof bar */}
      <div style={{ background: C.dark, padding: "24px clamp(24px,6vw,80px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 48, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { val: "4,9/5", label: "Note moyenne · 243 avis Planity" },
            { val: "+5 ans", label: "d'expérience terrain" },
            { val: "100%", label: "contenu issu de la pratique" },
            { val: "Certifiée", label: "formatrice professionnelle" },
          ].map((s) => (
            <div key={s.val} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: C.font, fontSize: 28, fontWeight: 400, color: "#fff", lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: C.fontSans, fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Who is it for */}
      <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)", background: C.ivory }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <TextReveal>
              <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.rose, marginBottom: 16, fontWeight: 500 }}>Ce guide est fait pour vous si…</div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2 style={{ fontFamily: C.font, fontSize: "clamp(38px,5vw,64px)", fontWeight: 400, color: C.dark, lineHeight: 1.1, marginBottom: 32 }}>
                Vous voulez maîtriser<br /><em>la beauté du regard</em>
              </h2>
            </TextReveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Vous démarrez en esthétique et voulez une base solide et complète",
                "Vous êtes déjà professionnelle mais manquez de ressources théoriques fiables",
                "Vous souhaitez ajouter les extensions de cils à votre catalogue de prestations",
                "Vous voulez lancer ou développer votre activité en indépendante",
                "Vous cherchez un guide en français, écrit par quelqu'un qui pratique vraiment",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{ display: "flex", alignItems: "flex-start", gap: 14 }}
                >
                  <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.blush, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: C.rose }}>✓</span>
                  </div>
                  <span style={{ fontFamily: C.fontSans, fontSize: 15, color: C.text, lineHeight: 1.6 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            {/* Author card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              style={{ background: C.bg, border: `1px solid ${C.ivoryDark}`, borderRadius: 2, padding: 40 }}
            >
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 28 }}>
                <img
                  src="/maison-maria/maria.jpeg"
                  alt="Maria — Fondatrice Maison Maria"
                  onError={(e) => { e.currentTarget.src = "/maison-maria/1.jpg"; }}
                  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontFamily: C.font, fontSize: 26, fontWeight: 500, color: C.dark, marginBottom: 4 }}>Maria</div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 12, color: C.rose, fontWeight: 500, letterSpacing: "0.05em" }}>Fondatrice · Maison Maria</div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 12, color: C.textMuted, marginTop: 2 }}>Vénissieux · 5 ans d'expérience · Formatrice certifiée</div>
                </div>
              </div>
              <blockquote style={{ fontFamily: C.font, fontSize: 18, fontStyle: "italic", color: C.text, lineHeight: 1.65, borderLeft: `3px solid ${C.roseLight}`, paddingLeft: 20, marginBottom: 24 }}>
                "Quand je me suis lancée, j'aurais voulu avoir un guide comme celui-là. Pas de la théorie abstraite — des techniques concrètes, des protocoles que j'utilise tous les jours, et des conseils business que personne ne partage."
              </blockquote>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["CAP Esthétique", "5 certifications spécialisées", "Formatrice", "4,9/5 · 243 avis"].map((tag) => (
                  <span key={tag} style={{ fontFamily: C.fontSans, fontSize: 11, color: C.roseDark, background: C.blush, padding: "5px 12px", borderRadius: 20, fontWeight: 500 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.two-col{grid-template-columns:1fr!important;}}`}</style>
      </section>

      {/* Chapters */}
      <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <TextReveal>
              <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.rose, marginBottom: 16, fontWeight: 500 }}>Au sommaire</div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2 style={{ fontFamily: C.font, fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 400, color: C.dark }}>
                34 pages, <em>zéro remplissage</em>
              </h2>
            </TextReveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 520px), 1fr))", gap: 28 }}>
            {CHAPTERS.map((ch, i) => (
              <motion.div
                key={ch.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                style={{ background: C.ivory, border: `1px solid ${C.ivoryDark}`, borderRadius: 2, padding: "32px 36px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <span style={{ fontFamily: C.font, fontSize: 48, fontWeight: 300, color: C.rose, lineHeight: 1, opacity: 0.5 }}>{ch.num}</span>
                  <span style={{ fontFamily: C.fontSans, fontSize: 11, color: C.textMuted, letterSpacing: "0.1em", background: C.bg, padding: "4px 12px", borderRadius: 20 }}>{ch.pages}</span>
                </div>
                <h3 style={{ fontFamily: C.font, fontSize: 24, fontWeight: 500, color: C.dark, marginBottom: 20, lineHeight: 1.2 }}>{ch.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {ch.topics.map((t) => (
                    <li key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: C.rose, fontSize: 12, marginTop: 4, flexShrink: 0 }}>◇</span>
                      <span style={{ fontFamily: C.fontSans, fontSize: 13.5, color: C.textMuted, lineHeight: 1.55 }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy section */}
      <section id="achat" style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)", background: C.dark, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "70vw", height: "70vw", maxWidth: 700, maxHeight: 700, borderRadius: "50%", background: `radial-gradient(circle, ${C.rose}15 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <TextReveal>
            <h2 style={{ fontFamily: C.font, fontSize: "clamp(42px,6vw,80px)", fontWeight: 300, color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
              Prête à passer<br /><em style={{ color: C.roseLight }}>au niveau supérieur ?</em>
            </h2>
          </TextReveal>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} style={{ fontFamily: C.fontSans, fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 48 }}>
            {EBOOK_PRICE}€ pour un guide clair et concret sur les extensions de cils — de quoi éviter les erreurs qui coûtent cher dès tes premières poses.
          </motion.p>

          {/* Pricing card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 2, padding: "48px 40px", marginBottom: 32 }}
          >
            <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: C.roseLight, marginBottom: 8 }}>Accès Complet</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, justifyContent: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: C.font, fontSize: 72, fontWeight: 300, color: "#fff", lineHeight: 1 }}>{EBOOK_PRICE}€</span>
            </div>
            <div style={{ fontFamily: C.fontSans, fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 36 }}>Paiement unique · Accès à vie</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
              {[
                "Guide PDF 34 pages — matériel, hygiène, erreurs à éviter",
                "2 bonus inclus : trouver et fidéliser tes clientes",
                "Livraison par e-mail",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: C.rose, fontSize: 14, marginTop: 2, flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: C.fontSans, fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>
            <MagneticButton
              onClick={handleStripeCheckout}
              style={{ width: "100%", padding: "18px 40px", background: checkoutLoading ? C.roseDark : C.rose, color: "#fff", border: "none", fontFamily: C.fontSans, fontSize: 14, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, cursor: checkoutLoading ? "wait" : "pointer", borderRadius: 1, opacity: checkoutLoading ? 0.8 : 1 }}
            >
              {checkoutLoading ? "Redirection…" : `Acheter le guide — ${EBOOK_PRICE}€`}
            </MagneticButton>
            <p style={{ fontFamily: C.fontSans, fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 14, marginBottom: 20 }}>
              💳 Paiement sécurisé · CB, Visa, Mastercard, Apple Pay, Google Pay · Facture disponible
            </p>
            {SUMUP_LINK && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
                <p style={{ fontFamily: C.fontSans, fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>
                  Ou payer avec SumUp :
                </p>
                <a
                  href={SUMUP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", textDecoration: "none", fontFamily: C.fontSans, fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", padding: "12px 28px", borderRadius: 2 }}
                >
                  Payer via SumUp →
                </a>
              </div>
            )}
          </motion.div>

          <p style={{ fontFamily: C.fontSans, fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.7 }}>
            En achetant, vous acceptez nos <Link href="/maison-maria/legal/cgv" style={{ color: C.roseLight, textDecoration: "none" }}>CGV</Link> et notre <Link href="/maison-maria/legal/confidentialite" style={{ color: C.roseLight, textDecoration: "none" }}>Politique de confidentialité</Link>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <TextReveal>
              <h2 style={{ fontFamily: C.font, fontSize: "clamp(38px,5vw,64px)", fontWeight: 400, color: C.dark }}>
                Questions <em>fréquentes</em>
              </h2>
            </TextReveal>
          </div>
          <div>
            {FAQS.map((faq) => <FAQ key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#120e0c", padding: "48px clamp(24px,6vw,80px) 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 32 }}>
          <Link href="/maison-maria" style={{ fontFamily: C.font, fontSize: 26, color: "#fff", textDecoration: "none" }}>Maison Maria</Link>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { label: "← Retour au site", href: "/maison-maria" },
              { label: "Mentions légales", href: "/maison-maria/legal/mentions-legales" },
              { label: "CGV", href: "/maison-maria/legal/cgv" },
              { label: "Confidentialité", href: "/maison-maria/legal/confidentialite" },
              { label: "Cookies", href: "/maison-maria/legal/cookies" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontFamily: C.fontSans, fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)", fontFamily: C.fontSans, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
          © 2026 Maison Maria · Institut de beauté · Vénissieux · Tous droits réservés
        </div>
      </footer>
    </div>
  );
}
