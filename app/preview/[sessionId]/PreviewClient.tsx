"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Rocket, Loader2, Globe, ChevronDown, Pencil } from "lucide-react";
import GeneratedSite from "@/components/GeneratedSite";
import { EditPanel } from "@/components/EditPanel";
import type { SessionData, GeneratedContent, FormData } from "@/lib/sessions";
import { useLang, LOCALE_META, type Locale } from "@/lib/LangContext";

type EditableData = {
  generatedContent: Partial<GeneratedContent>;
  formData: Partial<FormData>;
};

const T = {
  fr: {
    notFound: "Session introuvable.", startOver: "Recommencer →", edit: "Modifier",
    editContent: "Personnaliser",
    copied: "Copié !", shareLink: "Partager le lien", launch: "Je veux ce site",
    preview: "Aperçu", ready: "Votre site vous plaît ?",
    orderIntro: "Envoyez-nous un message et nous vous recontactons sous 2h pour finaliser et mettre votre site en ligne.",
    orderBtn: "Nous contacter →", backToPreview: "Retour à l'aperçu",
    yourLink: "Votre lien d'aperçu :",
    mailSubject: "Commande de site — AeviaLaunch",
    mailBody: "Bonjour,\n\nJe suis intéressé(e) par le site que vous avez généré pour moi.\nLien d'aperçu : {{link}}\n\nMerci de me recontacter.",
  },
  en: {
    notFound: "Session not found.", startOver: "Start over →", edit: "Edit",
    editContent: "Customize",
    copied: "Copied!", shareLink: "Share link", launch: "I want this site",
    preview: "Preview", ready: "Happy with your site?",
    orderIntro: "Send us a message and we'll get back to you within 2 hours to finalise and publish your site.",
    orderBtn: "Contact us →", backToPreview: "Back to preview",
    yourLink: "Your preview link:",
    mailSubject: "Site order — AeviaLaunch",
    mailBody: "Hello,\n\nI am interested in the site you generated for me.\nPreview link: {{link}}\n\nPlease get back to me.",
  },
  es: {
    notFound: "Sesión no encontrada.", startOver: "Empezar de nuevo →", edit: "Editar",
    editContent: "Personalizar",
    copied: "¡Copiado!", shareLink: "Compartir enlace", launch: "Quiero este sitio",
    preview: "Vista previa", ready: "¿Te gusta tu sitio?",
    orderIntro: "Envíanos un mensaje y te contactaremos en 2 horas para finalizar y publicar tu sitio.",
    orderBtn: "Contactarnos →", backToPreview: "Volver a la vista previa",
    yourLink: "Tu enlace de vista previa:",
    mailSubject: "Pedido de sitio — AeviaLaunch",
    mailBody: "Hola,\n\nEstoy interesado/a en el sitio que generaron para mí.\nEnlace de vista previa: {{link}}\n\nPor favor contáctenme.",
  },
  de: {
    notFound: "Sitzung nicht gefunden.", startOver: "Neu starten →", edit: "Bearbeiten",
    editContent: "Anpassen",
    copied: "Kopiert!", shareLink: "Link teilen", launch: "Ich will diese Website",
    preview: "Vorschau", ready: "Gefällt Ihnen Ihre Website?",
    orderIntro: "Schreiben Sie uns und wir melden uns innerhalb von 2 Stunden, um Ihre Website fertigzustellen.",
    orderBtn: "Kontakt aufnehmen →", backToPreview: "Zurück zur Vorschau",
    yourLink: "Ihr Vorschau-Link:",
    mailSubject: "Website-Bestellung — AeviaLaunch",
    mailBody: "Hallo,\n\nIch bin an der für mich generierten Website interessiert.\nVorschau-Link: {{link}}\n\nBitte melden Sie sich bei mir.",
  },
  pt: {
    notFound: "Sessão não encontrada.", startOver: "Recomeçar →", edit: "Editar",
    editContent: "Personalizar",
    copied: "Copiado!", shareLink: "Partilhar link", launch: "Quero este site",
    preview: "Pré-visualização", ready: "Gostou do seu site?",
    orderIntro: "Envie-nos uma mensagem e entraremos em contacto em 2 horas para finalizar e publicar o seu site.",
    orderBtn: "Contactar-nos →", backToPreview: "Voltar à pré-visualização",
    yourLink: "O seu link de pré-visualização:",
    mailSubject: "Pedido de site — AeviaLaunch",
    mailBody: "Olá,\n\nEstou interessado/a no site que geraram para mim.\nLink de pré-visualização: {{link}}\n\nPor favor contactem-me.",
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedSession, setEditedSession] = useState<SessionData | null>(null);

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

  const handleOrder = () => {
    const previewLink = window.location.href;
    const body = t.mailBody.replace("{{link}}", previewLink);
    window.location.href = `mailto:contact@aevia.io?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  const handleEditChange = (data: EditableData) => {
    setEditedSession((prev) => {
      const base = prev ?? session!;
      return {
        ...base,
        formData: { ...base.formData, ...data.formData } as FormData,
        generatedContent: { ...(base.generatedContent ?? {}), ...data.generatedContent } as GeneratedContent,
      } as SessionData;
    });
  };

  const handleEditSave = async (data: EditableData) => {
    await fetch(`/api/sessions?id=${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSession((prev) =>
      prev
        ? ({
            ...prev,
            formData: { ...prev.formData, ...data.formData } as FormData,
            generatedContent: { ...(prev.generatedContent ?? {}), ...data.generatedContent } as GeneratedContent,
          } as SessionData)
        : prev
    );
  };

  const liveSession = editedSession ?? session;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!session || !liveSession || !session.generatedContent) {
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
            onClick={() => setIsEditing((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
              isEditing
                ? "border-violet-500 text-violet-300 bg-violet-500/10"
                : "border-zinc-700 text-zinc-300 hover:text-white"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            {t.editContent}
          </button>

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
      <div className={`pt-14 transition-all duration-300 ${isEditing ? "mr-80" : ""}`}>
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

        <GeneratedSite session={liveSession} />
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
            <div className="w-14 h-14 rounded-full bg-violet-600/20 flex items-center justify-center mx-auto mb-5">
              <Rocket className="w-7 h-7 text-violet-400" />
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
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
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
