"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Rocket, Loader2, Globe, ChevronDown, Pencil, Sparkles, X } from "lucide-react";
import { MissingInfo } from "@/components/preview/MissingInfo";
import { EditPanel } from "@/components/EditPanel";
import type { SessionData, GeneratedContent, FormData } from "@/lib/sessions";
import { useLang, LOCALE_META, type Locale } from "@/lib/LangContext";
import { tierForTemplate } from "@/lib/templates/templateTier";
import { editTokenHeader } from "@/lib/editToken";

type EditableData = {
  generatedContent: Partial<GeneratedContent>;
  formData: Partial<FormData>;
  /** Les retouches de section, clé par clé — voir lib/templates/sectionManifest. */
  sectionOverrides?: Record<string, string>;
};

const T = {
  fr: {
    notFound: "Session introuvable.", startOver: "Recommencer →", edit: "Modifier",
    editContent: "Personnaliser",
    copied: "Copié !", shareLink: "Partager le lien", launch: "Je veux ce site",
    preview: "Aperçu", ready: "Votre site vous plaît ?",
    orderIntro: "Choisissez votre formule, réglez en ligne, et nous mettons votre site en ligne juste après. Tout reste modifiable ensuite.",
    orderBtn: "Commander & payer →", backToPreview: "Retour à l'aperçu",
    yourLink: "Votre lien d'aperçu :",
    mailSubject: "Commande de site — AeviaLaunch",
    mailBody: "Bonjour,\n\nJe suis intéressé(e) par le site que vous avez généré pour moi.\nLien d'aperçu : {{link}}\n\nMerci de me recontacter.",
    connectGoogle: "Connecter Google", googleConnecting: "Connexion à Google…",
    googleConnected: "Google Analytics et Search Console sont configurés automatiquement.",
    googlePartial: "Partiellement connecté — un des deux services n'a pas pu être configuré automatiquement, réessayez ou remplissez le champ manuellement à l'étape 6 du configurateur.",
    googleFailed: "La connexion Google a échoué, réessayez.",
    googleNoGa4Account: "Aucun compte Google Analytics trouvé sur ce compte Google. Créez-en un sur analytics.google.com puis reconnectez-vous.",
    googleError: "Une erreur est survenue pendant la connexion Google.",
  },
  en: {
    notFound: "Session not found.", startOver: "Start over →", edit: "Edit",
    editContent: "Customize",
    copied: "Copied!", shareLink: "Share link", launch: "I want this site",
    preview: "Preview", ready: "Happy with your site?",
    orderIntro: "Choose your plan, pay online, and we publish your site right after. Everything stays editable afterwards.",
    orderBtn: "Order & pay →", backToPreview: "Back to preview",
    yourLink: "Your preview link:",
    mailSubject: "Site order — AeviaLaunch",
    mailBody: "Hello,\n\nI am interested in the site you generated for me.\nPreview link: {{link}}\n\nPlease get back to me.",
    connectGoogle: "Connect Google", googleConnecting: "Connecting to Google…",
    googleConnected: "Google Analytics and Search Console are set up automatically.",
    googlePartial: "Partially connected — one of the two services couldn't be set up automatically, try again or fill it in manually in step 6 of the wizard.",
    googleFailed: "Google connection failed, please try again.",
    googleNoGa4Account: "No Google Analytics account found on this Google account. Create one at analytics.google.com then reconnect.",
    googleError: "Something went wrong connecting to Google.",
  },
  es: {
    notFound: "Sesión no encontrada.", startOver: "Empezar de nuevo →", edit: "Editar",
    editContent: "Personalizar",
    copied: "¡Copiado!", shareLink: "Compartir enlace", launch: "Quiero este sitio",
    preview: "Vista previa", ready: "¿Te gusta tu sitio?",
    orderIntro: "Elige tu plan, paga en línea y publicamos tu sitio justo después. Todo sigue siendo editable.",
    orderBtn: "Pedir y pagar →", backToPreview: "Volver a la vista previa",
    yourLink: "Tu enlace de vista previa:",
    mailSubject: "Pedido de sitio — AeviaLaunch",
    mailBody: "Hola,\n\nEstoy interesado/a en el sitio que generaron para mí.\nEnlace de vista previa: {{link}}\n\nPor favor contáctenme.",
    connectGoogle: "Conectar Google", googleConnecting: "Conectando con Google…",
    googleConnected: "Google Analytics y Search Console están configurados automáticamente.",
    googlePartial: "Parcialmente conectado — uno de los dos servicios no se pudo configurar automáticamente, inténtalo de nuevo o complétalo manualmente en el paso 6 del asistente.",
    googleFailed: "La conexión con Google falló, inténtalo de nuevo.",
    googleNoGa4Account: "No se encontró ninguna cuenta de Google Analytics en esta cuenta de Google. Crea una en analytics.google.com y vuelve a conectarte.",
    googleError: "Ocurrió un error al conectar con Google.",
  },
  de: {
    notFound: "Sitzung nicht gefunden.", startOver: "Neu starten →", edit: "Bearbeiten",
    editContent: "Anpassen",
    copied: "Kopiert!", shareLink: "Link teilen", launch: "Ich will diese Website",
    preview: "Vorschau", ready: "Gefällt Ihnen Ihre Website?",
    orderIntro: "Wählen Sie Ihr Paket, zahlen Sie online, und wir veröffentlichen Ihre Website direkt danach. Alles bleibt änderbar.",
    orderBtn: "Bestellen & zahlen →", backToPreview: "Zurück zur Vorschau",
    yourLink: "Ihr Vorschau-Link:",
    mailSubject: "Website-Bestellung — AeviaLaunch",
    mailBody: "Hallo,\n\nIch bin an der für mich generierten Website interessiert.\nVorschau-Link: {{link}}\n\nBitte melden Sie sich bei mir.",
    connectGoogle: "Google verbinden", googleConnecting: "Verbindung zu Google…",
    googleConnected: "Google Analytics und Search Console sind automatisch eingerichtet.",
    googlePartial: "Teilweise verbunden — einer der beiden Dienste konnte nicht automatisch eingerichtet werden, versuchen Sie es erneut oder tragen Sie es manuell in Schritt 6 des Assistenten ein.",
    googleFailed: "Die Google-Verbindung ist fehlgeschlagen, bitte erneut versuchen.",
    googleNoGa4Account: "Kein Google-Analytics-Konto für dieses Google-Konto gefunden. Erstellen Sie eines auf analytics.google.com und verbinden Sie sich erneut.",
    googleError: "Beim Verbinden mit Google ist ein Fehler aufgetreten.",
  },
  pt: {
    notFound: "Sessão não encontrada.", startOver: "Recomeçar →", edit: "Editar",
    editContent: "Personalizar",
    copied: "Copiado!", shareLink: "Partilhar link", launch: "Quero este site",
    preview: "Pré-visualização", ready: "Gostou do seu site?",
    orderIntro: "Escolha o seu plano, pague online e publicamos o seu site logo a seguir. Tudo continua editável.",
    orderBtn: "Encomendar e pagar →", backToPreview: "Voltar à pré-visualização",
    yourLink: "O seu link de pré-visualização:",
    mailSubject: "Pedido de site — AeviaLaunch",
    mailBody: "Olá,\n\nEstou interessado/a no site que geraram para mim.\nLink de pré-visualização: {{link}}\n\nPor favor contactem-me.",
    connectGoogle: "Ligar ao Google", googleConnecting: "A ligar ao Google…",
    googleConnected: "O Google Analytics e a Search Console estão configurados automaticamente.",
    googlePartial: "Ligação parcial — um dos dois serviços não pôde ser configurado automaticamente, tente novamente ou preencha manualmente no passo 6 do assistente.",
    googleFailed: "A ligação ao Google falhou, tente novamente.",
    googleNoGa4Account: "Nenhuma conta do Google Analytics encontrada nesta conta Google. Crie uma em analytics.google.com e ligue-se novamente.",
    googleError: "Ocorreu um erro ao ligar ao Google.",
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
              {l.code === locale && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400" />}
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedSession, setEditedSession] = useState<SessionData | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [googleStatus, setGoogleStatus] = useState<"connected" | "partial" | "failed" | "error" | null>(null);
  const [googleNoAccount, setGoogleNoAccount] = useState(false);

  useEffect(() => {
    /*
      La session vient d'un stockage distant, cohérent à terme. Le formulaire
      redirige ici dans la seconde qui suit son écriture : une seule lecture
      arrive parfois avant que l'objet ne soit lisible, et la page annonce
      « Session introuvable » alors que tout est en place. Mesuré sur cinq
      parcours réels sur cinquante et un — les cinq marchaient dix secondes plus
      tard.

      On réessaie donc, en s'espaçant, et l'on n'annonce l'échec qu'après.
    */
    let vivant = true;
    (async () => {
      for (const attente of [0, 700, 1500, 3000, 5000]) {
        if (!vivant) return;
        if (attente) await new Promise((r) => setTimeout(r, attente));
        try {
          const r = await fetch(`/api/sessions?id=${sessionId}`, { cache: "no-store" });
          if (!r.ok) continue;
          const data = await r.json();
          if (!data || !vivant) continue;
          setSession(data);
          setLoading(false);
          return;
        } catch {
          /* On réessaie. */
        }
      }
      if (vivant) setLoading(false);
    })();
    return () => { vivant = false; };
  }, [sessionId]);

  // Read the ?google=connected|partial|failed|error result left by the OAuth
  // callback redirect, then strip it from the URL so a refresh doesn't
  // re-show the banner.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("google");
    if (status === "connected" || status === "partial" || status === "failed" || status === "error") {
      setGoogleStatus(status);
      setGoogleNoAccount(params.get("ga4_reason") === "no_account");
      params.delete("google");
      params.delete("ga4_reason");
      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrder = () => {
    // Route into the real Stripe order flow (/order → /onboarding → /api/checkout)
    // carrying the wizard session so the brief + generated site persist through
    // payment. Formule is chosen on the order page (pricing grid).
    const params = new URLSearchParams({ session: sessionId });
    const name = liveSession?.formData?.businessName;
    const theme = liveSession?.formData?.template;
    if (name) params.set("name", name);
    if (theme) {
      params.set("theme", theme);
      // Price by the template's real depth (number of sections), not a flat
      // landing rate — most themes are rich full pages → Pro/Premium.
      params.set("type", tierForTemplate(theme));
    }
    window.location.href = `/order?${params.toString()}`;
  };

  const handleEditChange = (data: EditableData) => {
    setEditedSession((prev) => {
      const base = prev ?? session!;
      return {
        ...base,
        formData: { ...base.formData, ...data.formData } as FormData,
        generatedContent: { ...(base.generatedContent ?? {}), ...data.generatedContent } as GeneratedContent,
        sectionOverrides: { ...(base.sectionOverrides ?? {}), ...data.sectionOverrides },
      } as SessionData;
    });
  };

  const handleEditSave = async (data: EditableData) => {
    await fetch(`/api/sessions?id=${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...editTokenHeader(sessionId) },
      body: JSON.stringify(data),
    });
    setSession((prev) =>
      prev
        ? ({
            ...prev,
            formData: { ...prev.formData, ...data.formData } as FormData,
            generatedContent: { ...(prev.generatedContent ?? {}), ...data.generatedContent } as GeneratedContent,
            sectionOverrides: { ...(prev.sectionOverrides ?? {}), ...data.sectionOverrides },
          } as SessionData)
        : prev
    );
    setIframeKey((k) => k + 1);
  };

  const liveSession = editedSession ?? session;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-400 animate-spin" />
      </div>
    );
  }

  if (!session || !liveSession || !session.generatedContent) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">{t.notFound}</p>
          <Link href="/configure" className="text-red-400 hover:underline">{t.startOver}</Link>
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
            onClick={() => setIsEditing((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
              isEditing
                ? "border-red-500 text-red-300 bg-red-500/10"
                : "border-zinc-700 text-zinc-300 hover:text-white"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.editContent}</span>
          </button>

          {!(liveSession?.formData.ga4Id && liveSession?.formData.gscVerification) && (
            <a
              href={`/api/google/connect?session=${sessionId}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white text-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.connectGoogle}</span>
            </a>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white text-sm transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? t.copied : t.shareLink}</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.launch}</span>
          </button>
        </div>
      </div>

      {/* Google connect result banner */}
      {googleStatus && (
        <div className="pt-14">
          <div
            className={`mx-6 mt-3 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              googleStatus === "connected"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : googleStatus === "partial"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                  : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1">
              {googleStatus === "connected" && t.googleConnected}
              {googleStatus === "partial" && (googleNoAccount ? t.googleNoGa4Account : t.googlePartial)}
              {googleStatus === "failed" && t.googleFailed}
              {googleStatus === "error" && t.googleError}
            </span>
            <button onClick={() => setGoogleStatus(null)} aria-label="Fermer" className="shrink-0 opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Preview frame */}
      <div className={`${googleStatus ? "" : "pt-14"} transition-all duration-300 ${isEditing ? "md:mr-80" : ""}`}>
        <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-2 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 bg-zinc-800 rounded-md px-3 py-1 text-zinc-500 text-xs font-mono truncate">
            {t.preview} — {liveSession.formData.businessName}
          </div>
        </div>

        {/*
          On ne supprime aucune section et on n'invente rien : ce qui manque
          garde l'exemple du thème. Il faut donc le dire ici, sans quoi le client
          prend le contenu de démonstration pour une erreur de dossier.
        */}
        <MissingInfo session={liveSession} locale={locale} />

        {liveSession.formData.template?.startsWith("impact-") ? (
          <iframe
            key={iframeKey}
            src={`/templates/${liveSession.formData.template}?session=${sessionId}`}
            className="w-full border-none block"
            style={{ minHeight: "100vh" }}
            title="Site preview"
          />
        ) : (
          /*
            Pas de site de secours.

            Quand le thème n'est pas l'un des nôtres, un générateur générique
            fabriquait une page sans sections ni caractère. Le client croyait
            recevoir ce qu'il avait acheté — et jugeait le produit là-dessus.
            Mieux vaut dire qu'il y a un problème que livrer un site que nous ne
            vendons pas.
          */
          <div className="mx-auto max-w-2xl px-6 py-24 text-center">
            <p className="text-lg font-semibold text-white">
              Votre design n&apos;a pas été enregistré.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Nous préférons vous le dire plutôt que d&apos;afficher un site qui ne
              serait pas le vôtre. Reprenez le choix du design : votre brief est
              conservé.
            </p>
            <Link
              href={`/configure?session=${sessionId}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-500"
            >
              Choisir mon design
            </Link>
          </div>
        )}
      </div>

      {/* Inline editor panel */}
      {isEditing && (
        <EditPanel
          session={liveSession}
          onClose={() => setIsEditing(false)}
          onChange={handleEditChange}
          onSave={handleEditSave}
        />
      )}

      {/* Launch modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-14 h-14 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-5">
              <Rocket className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">{t.ready}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">{t.orderIntro}</p>
            <p className="text-zinc-500 text-xs mb-6">
              {t.yourLink} <span className="text-zinc-300 font-mono break-all">{typeof window !== "undefined" ? window.location.href : ""}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:text-white transition-colors"
              >
                {t.backToPreview}
              </button>
              <button
                onClick={handleOrder}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
              >
                {t.orderBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
