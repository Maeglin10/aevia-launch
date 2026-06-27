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

const EBOOK_PRICE = "49";
const EBOOK_ORIGINAL_PRICE = "79";
const EBOOK_TITLE = "Le Guide Complet de la Beauté du Regard";
const EBOOK_SUBTITLE = "Tout ce que j'ai appris en 5 ans de formation : extensions, sourcils, blanchiment, micropigmentation & développement de clientèle";
const PURCHASE_LINK = "#achat";
// Fallback SumUp link — to be replaced with Maria's actual SumUp payment link
const SUMUP_LINK = process.env.NEXT_PUBLIC_SUMUP_LINK ?? "";

const CHAPTERS = [
  {
    num: "01",
    title: "Les Extensions de Cils",
    pages: "42 pages",
    topics: [
      "Anatomie de l'œil et angles d'implantation",
      "Différences entre les volumes (Russe, Hybride, Wispy, Wet)",
      "Choix de la longueur, courbure et épaisseur",
      "Colle hypoallergénique : types, séchage, stockage",
      "Technique de pose sans douleur ni traumatisme",
      "Remplissages : fréquence, diagnostic, retouches",
      "Contre-indications absolues et relatives",
    ],
  },
  {
    num: "02",
    title: "Réhaussement & Teinture de Cils",
    pages: "28 pages",
    topics: [
      "Différence réhaussement / lifting / laminage",
      "Sélection des tiges de mise en forme",
      "Protocole de pose en binôme (séance duo)",
      "Teinture pour optimiser l'effet visuel",
      "Soin fortifiant post-réhaussement",
      "Durée de tenue et conseils d'entretien clients",
    ],
  },
  {
    num: "03",
    title: "Sourcils : Design, Épilation & Couleur",
    pages: "35 pages",
    topics: [
      "Morphologie du visage et mapping sourcil idéal",
      "Épilation à la pince : gestes, hygiène, précision",
      "Teinture simple vs teinture au henné",
      "Nuances et mélanges pour un résultat naturel",
      "Restructuration de sourcils clairsemés",
      "Fiche client et suivi photographique",
    ],
  },
  {
    num: "04",
    title: "Blanchiment Dentaire",
    pages: "31 pages",
    topics: [
      "Réglementation française et produits autorisés",
      "Différence séance simple / séance extrême",
      "Protocole de pose des plateaux d'activation",
      "Gestion de la sensibilité dentaire",
      "Strass Swarovski : pose et conseils d'entretien",
      "Séances en duo : organisation et optimisation",
    ],
  },
  {
    num: "05",
    title: "Micropigmentation",
    pages: "38 pages",
    topics: [
      "Microblading, ombré poudré, nanobrows : différences",
      "Choix des pigments et gestion du sous-ton",
      "Dessin préliminaire et validation cliente",
      "Technique de tracé poil par poil",
      "Protocole de cicatrisation et retouches",
      "Durée de tenue selon type de peau",
    ],
  },
  {
    num: "06",
    title: "Madérothérapie & Corps",
    pages: "26 pages",
    topics: [
      "Principes du drainage et de la sculpture corporelle",
      "Techniques bois : rouleau, coupe, ventouse",
      "Protocoles zone par zone (ventre, jambes, bras, fessiers)",
      "Corps entier : déroulement d'une séance de 2h",
      "Contre-indications et précautions",
      "Suivi résultats et programme pluriséances",
    ],
  },
  {
    num: "07",
    title: "Développer sa Clientèle & son Business",
    pages: "44 pages",
    topics: [
      "Se lancer : statut auto-entrepreneur, CFE, assurance RC",
      "Tarification : comment fixer ses prix et ne pas se sous-évaluer",
      "Planity, Instagram, bouche-à-oreille : stratégie clientèle",
      "Photos avant/après : matériel, lumière, cadrage",
      "Fidélisation : programme de suivi, relances, packs",
      "Mon parcours : erreurs à éviter, succès reproductibles",
    ],
  },
];

const BONUSES = [
  { icon: "📋", title: "Fiches Clients PDF", desc: "12 modèles de fiches clients prêts à imprimer — consentement, contre-indications, suivi prestation." },
  { icon: "📸", title: "Guide Photos Avant/Après", desc: "Mes réglages iPhone, angles recommandés, apps de montage gratuites pour des photos pro." },
  { icon: "💰", title: "Calculateur de Tarifs", desc: "Fichier Excel pour calculer votre prix de revient et fixer des tarifs rentables selon votre zone géographique." },
  { icon: "📱", title: "Kit Caption Instagram", desc: "30 accroches rédigées pour promouvoir vos prestations sur les réseaux sociaux — à copier-coller." },
];

const TESTIMONIALS = [
  {
    text: "J'ai suivi plusieurs formations payantes en académie, mais le niveau de détail dans ce guide est largement supérieur. Les fiches clients seules valent leur prix.",
    author: "Céline R.",
    role: "Esthéticienne indépendante · Lyon",
    stars: 5,
  },
  {
    text: "Le chapitre sur la micropigmentation m'a permis d'améliorer ma technique du tracé immédiatement. Les photos step-by-step sont exceptionnelles.",
    author: "Anaïs B.",
    role: "Prothésiste ongulaire reconvertie · Grenoble",
    stars: 5,
  },
  {
    text: "Enfin un guide écrit par quelqu'un qui pratique vraiment. Pas de la théorie recyclée — de l'expérience terrain. J'ai récupéré mes 49€ dès ma première semaine.",
    author: "Samira K.",
    role: "Auto-entrepreneuse beauté · Marseille",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "Je suis débutante, ce guide est-il fait pour moi ?",
    a: "Oui ! Le guide part du début (anatomie, matériel, sécurité) et monte progressivement en technicité. Si vous êtes déjà professionnelle, vous trouverez surtout de la valeur dans les chapitres micropigmentation, madérothérapie et développement clientèle.",
  },
  {
    q: "Le guide remplace-t-il une formation présentielle ?",
    a: "Non — et ce n'est pas son objectif. Les formations présentielles sont indispensables pour pratiquer sur un vrai modèle. Ce guide est un support de référence théorique, un aide-mémoire et un accélérateur. Il complète votre formation, il ne la remplace pas.",
  },
  {
    q: "Sous quelle forme est livré l'e-book ?",
    a: "En PDF haute résolution (optimisé écran et impression), accessible sur ordinateur, tablette et smartphone. Un lien de téléchargement vous est envoyé par e-mail dans les 30 minutes suivant votre paiement.",
  },
  {
    q: "Le guide est-il mis à jour ?",
    a: "Oui. En tant qu'acheteuse, vous recevrez par e-mail toutes les mises à jour futures gratuitement. Le guide est actuellement en version 2.0 (juin 2026).",
  },
  {
    q: "Puis-je partager ou revendre ce guide ?",
    a: "Non. L'achat vous confère une licence personnelle, non transférable. Toute reproduction ou revente, même partielle, est une violation du droit d'auteur et peut faire l'objet de poursuites. Consultez nos CGV pour les détails.",
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
                Guide professionnel · Version 2.0 · Juin 2026
              </span>
            </motion.div>

            <TextReveal>
              <h1 style={{ fontFamily: C.font, fontSize: "clamp(42px,6vw,80px)", fontWeight: 400, color: C.dark, lineHeight: 1.05, marginBottom: 4 }}>
                {EBOOK_TITLE}
              </h1>
            </TextReveal>
            <TextReveal delay={0.1}>
              <p style={{ fontFamily: C.fontSans, fontSize: 17, color: C.textMuted, lineHeight: 1.75, maxWidth: 580, marginTop: 20, marginBottom: 36 }}>
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
                { val: "244 pages", label: "de contenu dense" },
                { val: "7 chapitres", label: "techniques & business" },
                { val: "4 bonus", label: "fiches & outils PDF" },
                { val: "v2.0", label: "mise à jour juin 2026" },
              ].map((s) => (
                <div key={s.val}>
                  <div style={{ fontFamily: C.font, fontSize: 32, fontWeight: 500, color: C.dark, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontFamily: C.fontSans, fontSize: 12, color: C.textMuted, marginTop: 4, letterSpacing: "0.05em" }}>{s.label}</div>
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
                <span style={{ fontFamily: C.font, fontSize: 52, fontWeight: 400, color: C.dark }}>{EBOOK_PRICE}€</span>
                <span style={{ fontFamily: C.fontSans, fontSize: 18, color: C.textMuted, textDecoration: "line-through" }}>{EBOOK_ORIGINAL_PRICE}€</span>
                <span style={{ fontFamily: C.fontSans, fontSize: 13, color: C.rose, fontWeight: 600 }}>−38%</span>
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
            <div style={{ width: 280, height: 370, background: `linear-gradient(135deg, ${C.dark} 0%, #2d1f1c 100%)`, borderRadius: 8, boxShadow: `0 40px 80px rgba(26,20,18,0.35), 0 0 0 1px rgba(255,255,255,0.05)`, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 32 }}>
              {/* Decorative */}
              <div style={{ position: "absolute", top: 28, left: 28, right: 28, height: 2, background: `linear-gradient(90deg, ${C.rose}, ${C.roseLight})` }} />
              <div style={{ position: "absolute", top: 60, left: 28, right: 28 }}>
                <div style={{ fontFamily: C.fontSans, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: C.roseLight, marginBottom: 12, fontWeight: 500 }}>par Maria</div>
                <div style={{ fontFamily: C.font, fontStyle: "italic", fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Institut Maison Maria · Vénissieux</div>
                <div style={{ fontFamily: C.font, fontSize: 26, fontWeight: 400, color: "#fff", lineHeight: 1.2 }}>Le Guide Complet<br /><em style={{ color: C.roseLight }}>de la Beauté</em><br />du Regard</div>
              </div>
              <div style={{ position: "absolute", bottom: 28, left: 28, right: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: C.fontSans, fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>244 pages</span>
                <span style={{ fontFamily: C.fontSans, fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>Version 2.0</span>
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
                "Vous souhaitez élargir votre catalogue de prestations (madéro, micropigmentation, blanchiment)",
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
                244 pages, <em>zéro remplissage</em>
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

      {/* Bonuses */}
      <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)", background: C.blush }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <TextReveal>
              <div style={{ fontFamily: C.fontSans, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: C.roseDark, marginBottom: 16, fontWeight: 500 }}>Inclus gratuitement</div>
            </TextReveal>
            <TextReveal delay={0.1}>
              <h2 style={{ fontFamily: C.font, fontSize: "clamp(38px,5vw,64px)", fontWeight: 400, color: C.dark }}>
                4 outils <em>prêts à utiliser</em>
              </h2>
            </TextReveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 24 }}>
            {BONUSES.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                style={{ background: C.bg, border: `1px solid ${C.ivoryDark}`, borderRadius: 2, padding: "32px 28px" }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{b.icon}</div>
                <h3 style={{ fontFamily: C.font, fontSize: 22, fontWeight: 500, color: C.dark, marginBottom: 12 }}>{b.title}</h3>
                <p style={{ fontFamily: C.fontSans, fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "clamp(80px,12vw,140px) clamp(24px,6vw,80px)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <TextReveal>
              <h2 style={{ fontFamily: C.font, fontSize: "clamp(38px,5vw,64px)", fontWeight: 400, color: C.dark }}>
                Ce qu'elles en <em>pensent</em>
              </h2>
            </TextReveal>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ background: C.ivory, border: `1px solid ${C.ivoryDark}`, borderRadius: 2, padding: "36px 32px" }}
              >
                <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                  {Array.from({ length: t.stars }).map((_, j) => <span key={j} style={{ color: C.rose, fontSize: 14 }}>★</span>)}
                </div>
                <blockquote style={{ fontFamily: C.font, fontStyle: "italic", fontSize: 18, color: C.dark, lineHeight: 1.6, marginBottom: 24 }}>
                  "{t.text}"
                </blockquote>
                <div style={{ fontFamily: C.fontSans, fontSize: 13, fontWeight: 600, color: C.dark }}>{t.author}</div>
                <div style={{ fontFamily: C.fontSans, fontSize: 12, color: C.textMuted, marginTop: 3 }}>{t.role}</div>
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
            {EBOOK_PRICE}€ pour 244 pages de techniques, protocoles et conseils business — le prix de revient d'une seule prestation que vous perfectionnerez pour toujours.
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
              <span style={{ fontFamily: C.fontSans, fontSize: 22, color: "rgba(255,255,255,0.35)", textDecoration: "line-through" }}>{EBOOK_ORIGINAL_PRICE}€</span>
            </div>
            <div style={{ fontFamily: C.fontSans, fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 36 }}>Paiement unique · Accès à vie · Mises à jour incluses</div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 36px", display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
              {[
                "Guide PDF 244 pages — 7 chapitres techniques & business",
                "4 bonus : fiches clients, guide photos, calculateur de tarifs, kit Instagram",
                "Toutes les mises à jour futures gratuites",
                "Livraison par e-mail sous 30 minutes",
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
