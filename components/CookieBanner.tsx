"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/LangContext";

const CONSENT_KEY = "aevia-cookie-consent";

const T = {
  fr: {
    text: "Nous utilisons des cookies fonctionnels pour améliorer votre expérience. Aucun cookie de tracking sans votre accord.",
    more: "En savoir plus", accept: "Tout accepter", reject: "Tout refuser", customize: "Personnaliser",
    title: "Mes préférences cookies",
    essential: "Essentiels", essential_desc: "Nécessaires au fonctionnement du site (session, sécurité).",
    analytics: "Analytics", analytics_desc: "Google Analytics 4 — mesure de l'audience anonymisée.",
    marketing: "Marketing", marketing_desc: "Remarketing et personnalisation des publicités.",
    required: "Toujours actif", save: "Enregistrer mes préférences",
  },
  en: {
    text: "We use functional cookies to improve your experience. No tracking cookies without your consent.",
    more: "Learn more", accept: "Accept all", reject: "Decline all", customize: "Customize",
    title: "Cookie preferences",
    essential: "Essential", essential_desc: "Required for the site to work (session, security).",
    analytics: "Analytics", analytics_desc: "Google Analytics 4 — anonymous audience measurement.",
    marketing: "Marketing", marketing_desc: "Remarketing and personalized ads.",
    required: "Always on", save: "Save preferences",
  },
  es: {
    text: "Usamos cookies funcionales para mejorar tu experiencia. Sin cookies de rastreo sin tu consentimiento.",
    more: "Más información", accept: "Aceptar todo", reject: "Rechazar todo", customize: "Personalizar",
    title: "Mis preferencias de cookies",
    essential: "Esenciales", essential_desc: "Necesarias para el funcionamiento del sitio.",
    analytics: "Analytics", analytics_desc: "Google Analytics 4 — medición de audiencia anónima.",
    marketing: "Marketing", marketing_desc: "Remarketing y personalización de anuncios.",
    required: "Siempre activo", save: "Guardar preferencias",
  },
  de: {
    text: "Wir verwenden funktionale Cookies. Keine Tracking-Cookies ohne Ihre Zustimmung.",
    more: "Mehr erfahren", accept: "Alle akzeptieren", reject: "Alle ablehnen", customize: "Anpassen",
    title: "Cookie-Einstellungen",
    essential: "Wesentlich", essential_desc: "Für den Betrieb der Website erforderlich.",
    analytics: "Analytics", analytics_desc: "Google Analytics 4 — anonyme Reichweitenmessung.",
    marketing: "Marketing", marketing_desc: "Remarketing und personalisierte Werbung.",
    required: "Immer aktiv", save: "Einstellungen speichern",
  },
  pt: {
    text: "Usamos cookies funcionais para melhorar sua experiência. Sem cookies de rastreamento sem seu consentimento.",
    more: "Saber mais", accept: "Aceitar tudo", reject: "Recusar tudo", customize: "Personalizar",
    title: "Minhas preferências de cookies",
    essential: "Essenciais", essential_desc: "Necessários para o funcionamento do site.",
    analytics: "Analytics", analytics_desc: "Google Analytics 4 — medição de audiência anônima.",
    marketing: "Marketing", marketing_desc: "Remarketing e personalização de anúncios.",
    required: "Sempre ativo", save: "Salvar preferências",
  },
};

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange?.(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
        checked ? "bg-violet-500" : "bg-zinc-600"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export function CookieBanner() {
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"banner" | "customize">("banner");
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
  }, []);

  const save = (prefs: { analytics: boolean; marketing: boolean }) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, ...prefs, ts: Date.now() }));
    window.dispatchEvent(new Event("aevia-consent-updated"));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "110%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-4xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">

            {mode === "banner" ? (
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="flex-1 text-zinc-300 text-sm leading-relaxed">
                  {t.text}{" "}
                  <a href="https://aevia.services/fr/legal/cookies" target="_blank" rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors">
                    {t.more}
                  </a>
                </p>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button onClick={() => save({ analytics: false, marketing: false })}
                    className="px-4 py-2 rounded-full border border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-400 text-sm font-medium transition-colors">
                    {t.reject}
                  </button>
                  <button onClick={() => setMode("customize")}
                    className="px-4 py-2 rounded-full border border-violet-500/40 text-violet-400 hover:bg-violet-500/10 text-sm font-medium transition-colors">
                    {t.customize}
                  </button>
                  <button onClick={() => save({ analytics: true, marketing: true })}
                    className="px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
                    {t.accept}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 flex flex-col gap-4">
                <h3 className="text-white font-semibold text-base">{t.title}</h3>

                {[
                  { key: "essential", title: t.essential, desc: t.essential_desc, checked: true, disabled: true },
                  { key: "analytics", title: t.analytics, desc: t.analytics_desc, checked: analytics, disabled: false, onChange: setAnalytics },
                  { key: "marketing", title: t.marketing, desc: t.marketing_desc, checked: marketing, disabled: false, onChange: setMarketing },
                ].map((row, i, arr) => (
                  <div key={row.key} className={`flex items-start justify-between gap-4 pb-4 ${i < arr.length - 1 ? "border-b border-zinc-800" : ""}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{row.title}</p>
                      <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">{row.desc}</p>
                    </div>
                    {row.disabled
                      ? <span className="shrink-0 text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded-lg mt-0.5">{t.required}</span>
                      : <Toggle checked={row.checked} onChange={row.onChange} />
                    }
                  </div>
                ))}

                <div className="flex flex-wrap gap-2 pt-1">
                  <button onClick={() => save({ analytics: false, marketing: false })}
                    className="px-4 py-2 rounded-full border border-zinc-600 text-zinc-300 hover:text-white text-sm font-medium transition-colors">
                    {t.reject}
                  </button>
                  <button onClick={() => save({ analytics, marketing })}
                    className="px-4 py-2 rounded-full border border-violet-500/40 text-violet-400 hover:bg-violet-500/10 text-sm font-medium transition-colors">
                    {t.save}
                  </button>
                  <button onClick={() => save({ analytics: true, marketing: true })}
                    className="px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
                    {t.accept}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
