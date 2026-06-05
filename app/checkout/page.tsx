"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Suspense } from "react";
import { useLang } from "@/lib/LangContext";

const T = {
  fr: {
    errSession: "Erreur lors de la création de la session.",
    errUrl: "URL de paiement manquante.",
    errUnexpected: "Une erreur inattendue s'est produite.",
    payError: "Erreur de paiement", back: "Retour",
    preparing: "Préparation du paiement sécurisé…", redirecting: "Vous allez être redirigé vers Stripe",
    sslHint: "Connexion chiffrée SSL · Stripe Payments",
  },
  en: {
    errSession: "Error creating the session.",
    errUrl: "Payment URL missing.",
    errUnexpected: "An unexpected error occurred.",
    payError: "Payment error", back: "Back",
    preparing: "Preparing secure payment…", redirecting: "You'll be redirected to Stripe",
    sslHint: "SSL-encrypted connection · Stripe Payments",
  },
  es: {
    errSession: "Error al crear la sesión.",
    errUrl: "Falta la URL de pago.",
    errUnexpected: "Se produjo un error inesperado.",
    payError: "Error de pago", back: "Atrás",
    preparing: "Preparando el pago seguro…", redirecting: "Serás redirigido a Stripe",
    sslHint: "Conexión cifrada SSL · Stripe Payments",
  },
  de: {
    errSession: "Fehler beim Erstellen der Sitzung.",
    errUrl: "Zahlungs-URL fehlt.",
    errUnexpected: "Ein unerwarteter Fehler ist aufgetreten.",
    payError: "Zahlungsfehler", back: "Zurück",
    preparing: "Sichere Zahlung wird vorbereitet…", redirecting: "Sie werden zu Stripe weitergeleitet",
    sslHint: "SSL-verschlüsselte Verbindung · Stripe Payments",
  },
  pt: {
    errSession: "Erro ao criar a sessão.",
    errUrl: "URL de pagamento em falta.",
    errUnexpected: "Ocorreu um erro inesperado.",
    payError: "Erro de pagamento", back: "Voltar",
    preparing: "A preparar o pagamento seguro…", redirecting: "Será redirecionado para a Stripe",
    sslHint: "Ligação encriptada SSL · Stripe Payments",
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;
  const type        = searchParams.get("type")        ?? "landing";
  const name        = searchParams.get("name")        ?? "Votre site";
  const theme       = searchParams.get("theme")       ?? type;
  const maintenance = searchParams.get("maintenance") ?? "0";

  const [error, setError] = useState<string | null>(null);
  // Guard against React Strict Mode double-invocation in dev
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    async function startCheckout() {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, name, theme, maintenance }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            (data as { error?: string }).error ?? t.errSession,
          );
        }

        const { url } = (await res.json()) as { url: string };
        if (!url) throw new Error(t.errUrl);

        window.location.href = url;
      } catch (err) {
        console.error("[checkout page]", err);
        setError(
          err instanceof Error
            ? err.message
            : t.errUnexpected,
        );
      }
    }

    startCheckout();
    // `t` is intentionally omitted: the `called` ref guards re-runs, and the
    // checkout POST must fire exactly once regardless of locale changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, name, theme, maintenance]);

  const cancelHref =
    `/order?type=${encodeURIComponent(type)}` +
    `&name=${encodeURIComponent(name)}` +
    `&theme=${encodeURIComponent(theme)}` +
    `&maintenance=${maintenance}`;

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl shadow-black/40">
          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-white font-bold text-lg mb-2">
            {t.payError}
          </h2>
          <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{error}</p>
          <Link
            href={cancelHref}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            {t.back}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6">
        {/* Spinning violet ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin"
            style={{ animationDuration: "800ms" }}
          />
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-violet-600 animate-pulse" />
          </div>
        </div>

        <div className="text-center">
          <p className="text-white font-semibold text-lg">
            {t.preparing}
          </p>
          <p className="text-zinc-500 text-sm mt-1.5">
            {t.redirecting}
          </p>
        </div>

        {/* Trust hint */}
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <svg
            className="w-3.5 h-3.5 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          {t.sslHint}
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Chargement...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
