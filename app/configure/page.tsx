"use client";
import { Suspense } from "react";
import { StepForm } from "@/components/StepForm";
import { useLang } from "@/lib/LangContext";
import { LegalFooter } from "@/components/LegalFooter";
import { AeviaHeader } from "@/components/AeviaHeader";

const T = {
  fr: { title: "Créez votre site", sub: "7 étapes rapides — moins de 5 minutes" },
  en: { title: "Build your site", sub: "7 quick steps — under 5 minutes" },
  es: { title: "Crea tu sitio web", sub: "7 pasos rápidos — menos de 5 minutos" },
  de: { title: "Erstelle deine Website", sub: "7 schnelle Schritte — unter 5 Minuten" },
  pt: { title: "Crie seu site", sub: "7 etapas rápidas — em menos de 5 minutos" },
};

export default function ConfigurePage() {
  const { locale } = useLang();
  const t = T[locale as keyof typeof T] ?? T.fr;
  return (
    <div id="main-content" className="font-aevia-body min-h-screen bg-[#09090b] text-white pt-16 flex flex-col">
      <AeviaHeader />
      <div className="mx-auto max-w-xl px-6 py-16 flex flex-col items-center flex-1 w-full">
        <div className="text-center mb-10">
          <h1 className="font-aevia-display text-3xl font-bold text-white mb-3">{t.title}</h1>
          <p className="text-zinc-300">{t.sub}</p>
        </div>
        <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
          <StepForm />
        </Suspense>
      </div>
      <LegalFooter variant="dark" />
    </div>
  );
}
