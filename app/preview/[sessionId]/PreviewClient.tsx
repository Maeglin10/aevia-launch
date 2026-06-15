"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Rocket, Loader2, Globe, ChevronDown } from "lucide-react";
import GeneratedSite from "@/components/GeneratedSite";
import type { SessionData } from "@/lib/sessions";
import { useLang, LOCALE_META, type Locale } from "@/lib/LangContext";

const T = {
  fr: {
    notFound: "Session introuvable.", startOver: "Recommencer →", edit: "Modifier",
    copied: "Copié !", shareLink: "Partager le lien", launch: "Lancer mon site",
    preview: "Aperçu", ready: "Prêt à lancer !",
    reachOutA: "Nous vous contacterons à", reachOutB: "sous", twoHours: "2 heures",
    reachOutC: "pour finaliser et mettre votre site en ligne.",
    yourLink: "Votre lien d'aperçu :", backToPreview: "Retour à l'aperçu", confirmLaunch: "Confirmer le lancement",
  },
  en: {
    notFound: "Session not found.", startOver: "Start over →", edit: "Edit",
    copied: "Copied!", shareLink: "Share link", launch: "Launch my site",
    preview: "Preview", ready: "Ready to launch!",
    reachOutA: "We'll reach out to", reachOutB: "within", twoHours: "2 hours",
    reachOutC: "to finalise and deploy your site live.",
    yourLink: "Your preview link:", backToPreview: "Back to preview", confirmLaunch: "Confirm launch",
  },
  es: {
    notFound: "Sesión no encontrada.", startOver: "Empezar de nuevo →", edit: "Editar",
    copied: "¡Copiado!", shareLink: "Compartir enlace", launch: "Lanzar mi sitio",
    preview: "Vista previa", ready: "¡Listo para lanzar!",
    reachOutA: "Te contactaremos a", reachOutB: "en", twoHours: "2 horas",
    reachOutC: "para finalizar y publicar tu sitio en vivo.",
    yourLink: "Tu enlace de vista previa:", backToPreview: "Volver a la vista previa", confirmLaunch: "Confirmar lanzamiento",
  },
  de: {
    notFound: "Sitzung nicht gefunden.", startOver: "Neu starten →", edit: "Bearbeiten",
    copied: "Kopiert!", shareLink: "Link teilen", launch: "Website starten",
    preview: "Vorschau", ready: "Bereit zum Start!",
    reachOutA: "Wir melden uns bei", reachOutB: "innerhalb von", twoHours: "2 Stunden",
    reachOutC: "um Ihre Website fertigzustellen und live zu schalten.",
    yourLink: "Ihr Vorschau-Link:", backToPreview: "Zurück zur Vorschau", confirmLaunch: "Start bestätigen",
  },
  pt: {
    notFound: "Sessão não encontrada.", startOver: "Recomeçar →", edit: "Editar",
    copied: "Copiado!", shareLink: "Partilhar link", launch: "Lançar o meu site",
    preview: "Pré-visualização", ready: "Pronto para lançar!",
    reachOutA: "Entraremos em contacto com", reachOutB: "em", twoHours: "2 horas",
    reachOutC: "para finalizar e publicar o seu site.",
    yourLink: "O seu link de pré-visualização:", backToPreview: "Voltar à pré-visualização", confirmLaunch: "Confirmar lançamento",
  },
};

function PreviewLangSwitcher() {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const current = LOCALE_META.find((l) => l.code === locale) ?? LOCALE_META[0];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Changer de langue"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{current.flag} {current.code.toUpperCase()}</span>
        <span className="sm:hidden">{current.flag}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 overflow-hidden z-50">
          {LOCALE_META.map((l) => (
            <button key={l.code} onClick={() => { setLocale(l.code as Locale); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-zinc-800 ${l.code === locale ? "text-white font-semibold" : "text-zinc-400"}`}
            >
              <span>{l.flag}</span><span>{l.label}</span>
              {l.code === locale && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PreviewClient({ sessionId }: { sessionId: string }) {
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  useEffect(() => {
    fetch(`/api/sessions?id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => { setSession(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sessionId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Stripe error");
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Erreur inattendue");
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!session || !session.generatedContent) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">{t.notFound}</p>
          <Link href="/configure" className="text-violet-400 hover:underline">{t.startOver}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Floating action bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/configure" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t.edit}
        </Link>

        <div className="flex items-center gap-3">
          <PreviewLangSwitcher />
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white text-sm transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t.copied : t.shareLink}
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
          >
            <Rocket className="w-3.5 h-3.5" />
            {t.launch}
          </button>
        </div>
      </div>

      {/* Preview frame */}
      <div className="pt-14">
        <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-2 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 bg-zinc-800 rounded-md px-3 py-1 text-zinc-500 text-xs font-mono truncate">
            {t.preview} — {session.formData.businessName}
          </div>
        </div>

        <GeneratedSite session={session} />
      </div>

      {/* Launch modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-violet-600/20 flex items-center justify-center mx-auto mb-5">
              <Rocket className="w-7 h-7 text-violet-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">{t.ready}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {t.reachOutA} <span className="text-white font-medium">{session.formData.email}</span> {t.reachOutB}{" "}
              <span className="text-violet-400 font-semibold">{t.twoHours}</span> {t.reachOutC}
            </p>
            <p className="text-zinc-500 text-xs mb-6">
              {t.yourLink} <span className="text-zinc-300 font-mono break-all">{typeof window !== "undefined" ? window.location.href : ""}</span>
            </p>
            {checkoutError && (
              <p className="text-red-400 text-xs mb-3 text-center">{checkoutError}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:text-white transition-colors"
              >
                {t.backToPreview}
              </button>
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                {checkoutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t.confirmLaunch}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
