"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { ExternalLink, Copy, Check } from "lucide-react";
import { AeviaHeader } from "@/components/AeviaHeader";
import { useLang } from "@/lib/LangContext";

const T = {
  fr: {
    success: "Succès",
    title: "Commande confirmée !",
    thanks: "Merci",
    yourSite: ", votre site",
    inPrep: "est en préparation.",
    contact: "Notre équipe vous contacte sous 2h.",
    checkEmails: "Vérifiez vos emails.",
    badgePaid: "Paiement reçu",
    badgeConfirm: "Confirmation envoyée",
    badgeDelivery: "Livraison dans 2h",
    backHome: "Retour à l'accueil",
    loading: "Chargement...",
  },
  en: {
    success: "Success",
    title: "Order confirmed!",
    thanks: "Thank you",
    yourSite: ", your",
    inPrep: "site is being prepared.",
    contact: "Our team will contact you within 2h.",
    checkEmails: "Check your emails.",
    badgePaid: "Payment received",
    badgeConfirm: "Confirmation sent",
    badgeDelivery: "Delivery in 2h",
    backHome: "Back to home",
    loading: "Loading...",
  },
  es: {
    success: "Éxito",
    title: "¡Pedido confirmado!",
    thanks: "Gracias",
    yourSite: ", tu sitio",
    inPrep: "se está preparando.",
    contact: "Nuestro equipo te contactará en 2h.",
    checkEmails: "Revisa tus correos.",
    badgePaid: "Pago recibido",
    badgeConfirm: "Confirmación enviada",
    badgeDelivery: "Entrega en 2h",
    backHome: "Volver al inicio",
    loading: "Cargando...",
  },
  de: {
    success: "Erfolg",
    title: "Bestellung bestätigt!",
    thanks: "Danke",
    yourSite: ", deine",
    inPrep: "Website wird vorbereitet.",
    contact: "Unser Team meldet sich innerhalb von 2 Std.",
    checkEmails: "Prüfe deine E-Mails.",
    badgePaid: "Zahlung erhalten",
    badgeConfirm: "Bestätigung gesendet",
    badgeDelivery: "Lieferung in 2 Std.",
    backHome: "Zurück zur Startseite",
    loading: "Wird geladen...",
  },
  pt: {
    success: "Sucesso",
    title: "Pedido confirmado!",
    thanks: "Obrigado",
    yourSite: ", o seu site",
    inPrep: "está sendo preparado.",
    contact: "A nossa equipa entra em contacto em 2h.",
    checkEmails: "Verifique os seus emails.",
    badgePaid: "Pagamento recebido",
    badgeConfirm: "Confirmação enviada",
    badgeDelivery: "Entrega em 2h",
    backHome: "Voltar ao início",
    loading: "A carregar...",
  },
};

// ─── Confetti particle ─────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;      // vw start
  delay: number;  // seconds
  duration: number;
  color: string;
  size: number;
  drift: number;  // vw horizontal drift
  spin: 1 | -1;  // rotation direction
}

const COLORS = [
  "#dc2626", "#a855f7", "#c084fc",
  "#06b6d4", "#818cf8", "#f87171",
  "#34d399", "#f472b6",
];

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.2,
    duration: 1.8 + Math.random() * 1.4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 5 + Math.random() * 7,
    drift: (Math.random() - 0.5) * 30,
    spin: (Math.random() > 0.5 ? 1 : -1) as 1 | -1,
  }));
}

function Confetti() {
  const [particles] = useState<Particle[]>(() => buildParticles(60));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-10vh", x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            x: `calc(${p.x}vw + ${p.drift}vw)`,
            opacity: [1, 1, 0],
            rotate: 360 * p.spin,
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: "easeIn",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: p.size,
            height: p.size * 0.45,
            borderRadius: 2,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated checkmark ────────────────────────────────────────────────────────

function AnimatedCheck() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
      className="relative flex items-center justify-center"
    >
      {/* Outer glow ring */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.15, opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="absolute w-24 h-24 rounded-full bg-red-500/30"
      />
      {/* Circle */}
      <div className="w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center">
        <svg
          viewBox="0 0 52 52"
          fill="none"
          className="w-10 h-10"
          aria-label="Succès"
        >
          <motion.circle
            cx="26"
            cy="26"
            r="24"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M14 26 L22 34 L38 18"
            stroke="#a855f7"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.5, ease: "easeOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

const SITE_LABELS: Record<string, string> = {
  landing: "Landing Page", saas: "SaaS Product", agency: "Creative Agency",
  vitrine: "Site Vitrine", consultant: "Consultant / Coach", portfolio: "Portfolio",
  ecommerce: "E-Commerce", restaurant: "Restaurant / Food", hotel: "Hôtel / B&B",
  healthcare: "Santé / Clinique", realestate: "Immobilier", fitness: "Fitness / Wellness",
  event: "Événement", nonprofit: "Non-profit / ONG", startup: "Startup Launch",
  luxury: "Luxury / Couture", brutalist: "Brutalist Editorial", magazine: "Magazine / Éditorial",
  aurora: "Aurora / Wellness", "3d-tech": "3D Tech / Web3", "minimal-pro": "Minimal Pro",
};

// Fire confetti only once per mount, not on re-renders
function useOnce(fn: () => void) {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    fn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;
  const name      = searchParams.get("name") ?? searchParams.get("siteName") ?? "Votre site";
  const type      = searchParams.get("type") ?? "landing";
  const sessionId = searchParams.get("sessionId") ?? "";
  const typeLabel  = SITE_LABELS[type] ?? type;

  const previewUrl = sessionId
    ? `${typeof window !== "undefined" ? window.location.origin : "https://launch.aevia.services"}/preview/${sessionId}`
    : null;

  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);

  useOnce(() => setShowConfetti(true));

  const handleCopy = () => {
    if (previewUrl) {
      navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stagger: Record<string, Variants> = {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    },
  };

  return (
    <main className="font-aevia-body relative min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 overflow-hidden">
      <AeviaHeader />
      {/* Confetti burst */}
      {showConfetti && <Confetti />}

      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(109,40,217,0.12) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50"
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-red-500 to-transparent" />

        <div className="px-8 py-10 flex flex-col items-center text-center gap-0">

          {/* Checkmark */}
          <AnimatedCheck />

          {/* Text content */}
          <motion.div
            variants={stagger.container}
            initial="hidden"
            animate="show"
            className="mt-7 flex flex-col items-center gap-3"
          >
            <motion.h1
              variants={stagger.item}
              className="text-2xl font-extrabold text-white tracking-tight"
            >
              {t.title}
            </motion.h1>

            <motion.p
              variants={stagger.item}
              className="text-zinc-300 text-sm leading-relaxed max-w-xs"
            >
              {t.thanks}{" "}
              <span className="text-red-400 font-semibold">{name}</span>
              {t.yourSite}{" "}
              <span className="text-white font-medium">{typeLabel}</span>{" "}
              {t.inPrep}
            </motion.p>

            <motion.p
              variants={stagger.item}
              className="text-zinc-500 text-sm leading-relaxed"
            >
              {t.contact}{" "}
              <br className="hidden sm:block" />
              {t.checkEmails}
            </motion.p>
          </motion.div>

          {/* Divider */}
          <div className="my-7 w-full border-t border-zinc-800" />

          {/* Permanent preview link (when coming from preview checkout) */}
          {previewUrl && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="w-full mb-5 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-left"
            >
              <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">Votre site est en ligne :</p>
              <p className="text-red-400 font-mono text-xs break-all mb-3">{previewUrl}</p>
              <div className="flex gap-2">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Voir mon site
                </a>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white text-xs rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Status badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-7"
          >
            {[
              t.badgePaid,
              t.badgeConfirm,
              t.badgeDelivery,
            ].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 font-medium"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  aria-hidden
                />
                {badge}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.4 }}
            className="w-full"
          >
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-900/30"
            >
              {t.backHome}
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
