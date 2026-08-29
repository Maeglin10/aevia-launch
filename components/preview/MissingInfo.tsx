"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Pencil } from "lucide-react";
import type { BusinessProfile, SessionData } from "@/lib/sessions";
import { blocksForTheme, type ContentBlock } from "@/lib/templates/capabilities";

/**
 * Ce que le client n'a pas renseigné, et que le thème affiche donc encore avec
 * son contenu d'exemple.
 *
 * La règle est de ne rien inventer et de ne supprimer aucune section : si une
 * information manque, le thème garde la sienne. Le corollaire est qu'il faut le
 * dire — sans quoi le client découvre les prestations d'un couvreur d'Angers sur
 * son propre site et croit que nous nous sommes trompés de dossier.
 */

const LABELS: Record<string, Partial<Record<ContentBlock, string>>> = {
  fr: {
    prestations: "vos prestations et leurs tarifs",
    avis: "vos avis clients",
    chiffres: "vos chiffres clés",
    engagements: "vos garanties et certifications",
    methode: "les étapes de votre méthode",
    tarifs: "vos tarifs",
    realisations: "vos réalisations",
    faq: "vos questions fréquentes",
    equipe: "votre équipe",
    horaires: "vos horaires",
    menu: "votre carte",
    produits: "vos produits",
    zones: "votre zone d'intervention",
  },
  en: {
    prestations: "your services and their prices",
    avis: "your customer reviews",
    chiffres: "your key figures",
    engagements: "your guarantees and certifications",
    methode: "the steps of your method",
    tarifs: "your prices",
    realisations: "your past work",
    faq: "your frequently asked questions",
    equipe: "your team",
    horaires: "your opening hours",
    menu: "your menu",
    produits: "your products",
    zones: "the area you cover",
  },
  es: {
    prestations: "tus servicios y sus precios",
    avis: "tus opiniones de clientes",
    chiffres: "tus cifras clave",
    engagements: "tus garantías y certificaciones",
    methode: "las etapas de tu método",
    tarifs: "tus tarifas",
    realisations: "tus trabajos realizados",
    faq: "tus preguntas frecuentes",
    equipe: "tu equipo",
    horaires: "tu horario",
    menu: "tu carta",
    produits: "tus productos",
    zones: "tu zona de intervención",
  },
  de: {
    prestations: "Ihre Leistungen und deren Preise",
    avis: "Ihre Kundenbewertungen",
    chiffres: "Ihre Kennzahlen",
    engagements: "Ihre Garantien und Zertifikate",
    methode: "die Schritte Ihrer Methode",
    tarifs: "Ihre Preise",
    realisations: "Ihre Referenzen",
    faq: "Ihre häufigen Fragen",
    equipe: "Ihr Team",
    horaires: "Ihre Öffnungszeiten",
    menu: "Ihre Karte",
    produits: "Ihre Produkte",
    zones: "Ihr Einsatzgebiet",
  },
  pt: {
    prestations: "os seus serviços e respetivos preços",
    avis: "as suas avaliações de clientes",
    chiffres: "os seus números-chave",
    engagements: "as suas garantias e certificações",
    methode: "as etapas do seu método",
    tarifs: "os seus preços",
    realisations: "os seus trabalhos",
    faq: "as suas perguntas frequentes",
    equipe: "a sua equipa",
    horaires: "o seu horário",
    menu: "a sua carta",
    produits: "os seus produtos",
    zones: "a sua zona de intervenção",
  },
};

const COPY: Record<
  string,
  { title: string; body: string; cta: string; reduire: string; rouvrir: string; manque: string }
> = {
  fr: {
    title: "Ces sections montrent encore l'exemple du thème",
    body: "Nous n'inventons rien à votre place. Tant que vous ne les renseignez pas, elles gardent le contenu de démonstration — visible par vos visiteurs.",
    cta: "Compléter",
    reduire: "Réduire",
    rouvrir: "Voir ce qui manque",
    manque: "à compléter",
  },
  en: {
    title: "These sections still show the theme's example",
    body: "We invent nothing on your behalf. Until you fill them in they keep the demo content — which your visitors will see.",
    cta: "Fill in",
    reduire: "Minimise",
    rouvrir: "See what's missing",
    manque: "to fill in",
  },
  es: {
    title: "Estas secciones aún muestran el ejemplo del tema",
    body: "No inventamos nada por ti. Mientras no las completes conservan el contenido de demostración, visible para tus visitantes.",
    cta: "Completar",
    reduire: "Reducir",
    rouvrir: "Ver lo que falta",
    manque: "por completar",
  },
  de: {
    title: "Diese Abschnitte zeigen noch das Beispiel des Themes",
    body: "Wir erfinden nichts für Sie. Solange Sie sie nicht ausfüllen, behalten sie den Demo-Inhalt — für Ihre Besucher sichtbar.",
    cta: "Ausfüllen",
    reduire: "Verkleinern",
    rouvrir: "Fehlendes anzeigen",
    manque: "auszufüllen",
  },
  pt: {
    title: "Estas secções ainda mostram o exemplo do tema",
    body: "Não inventamos nada por si. Enquanto não as preencher, mantêm o conteúdo de demonstração — visível para os seus visitantes.",
    cta: "Preencher",
    reduire: "Reduzir",
    rouvrir: "Ver o que falta",
    manque: "por preencher",
  },
};

/** Les blocs déclarés par le thème pour lesquels le client n'a rien fourni. */
export function missingBlocks(session: SessionData): ContentBlock[] {
  const bp: BusinessProfile | undefined = session.businessProfile;
  const filled: Partial<Record<ContentBlock, boolean>> = {
    prestations: (bp?.services ?? []).some((s) => s.name?.trim()),
    tarifs: (bp?.services ?? []).some((s) => s.price?.trim()),
    avis: (bp?.reputation?.featuredReviews ?? []).some((r) => r.text?.trim()),
    chiffres: (bp?.keyStats ?? []).some((s) => s.value?.trim()),
    engagements: (bp?.certifications ?? []).some((c) => c?.trim()),
    faq: (bp?.faq ?? []).some((f) => f.q?.trim()),
    equipe: (bp?.team ?? []).some((m) => m.name?.trim()),
    zones: (bp?.geo?.serviceAreas ?? []).length > 0,
    horaires: (bp?.openingHours ?? []).length > 0,
    menu: (bp?.menu ?? []).length > 0,
    produits: (bp?.products ?? []).length > 0,
    realisations: (bp?.beforeAfter ?? []).length > 0,
  };
  // methode n'a pas de champ dédié : le wizard ne le demande pas encore, donc on
  // ne peut pas honnêtement dire au client qu'il a oublié de le remplir.
  return blocksForTheme(session.formData?.template).filter(
    (b) => b !== "methode" && filled[b] === false,
  );
}

export function MissingInfo({
  session,
  locale = "fr",
}: {
  session: SessionData;
  locale?: string;
}) {
  const missing = missingBlocks(session);

  /*
    Le panneau se réduit, il ne se ferme pas.

    Il était posé au-dessus du site et le poussait vers le bas : sur un
    téléphone — sept visites sur dix — il ne restait qu'une fenêtre étroite
    pour voir son propre thème. Or c'est justement ce que le client vient
    regarder.

    Fermer pour de bon serait pire : il ne saurait plus que des sections
    montrent encore l'exemple du thème, et croirait à une erreur de dossier.
    Réduit, le panneau devient une pastille qui compte ce qui manque, et
    revient d'un geste.

    L'état se retient le temps de la visite : rouvrir à chaque retour de page
    reviendrait à ne pas l'avoir réduit.
  */
  const cle = `apercu-manques-reduit:${session.id}`;
  const [reduit, setReduit] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem(cle) === "1") setReduit(true);
    } catch {}
  }, [cle]);

  const basculer = (valeur: boolean) => {
    setReduit(valeur);
    try {
      sessionStorage.setItem(cle, valeur ? "1" : "0");
    } catch {}
  };

  if (missing.length === 0) return null;

  const labels = LABELS[locale] ?? LABELS.fr;
  const copy = COPY[locale] ?? COPY.fr;

  if (reduit) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-2">
        <button
          type="button"
          onClick={() => basculer(false)}
          aria-label={`${missing.length} ${copy.manque} — ${copy.rouvrir}`}
          className="flex w-full items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-left text-xs text-amber-100 transition-colors hover:bg-amber-500/20"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-zinc-900">
            {missing.length}
          </span>
          <span className="min-w-0 flex-1 truncate">{copy.rouvrir}</span>
          <ChevronDown size={14} className="shrink-0 rotate-180 opacity-70" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-4">
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <p className="min-w-0 flex-1 text-sm font-semibold text-amber-200">{copy.title}</p>
          <button
            type="button"
            onClick={() => basculer(true)}
            aria-label={copy.reduire}
            title={copy.reduire}
            className="-mr-1 -mt-1 flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs text-amber-200/80 transition-colors hover:bg-amber-500/20 hover:text-amber-100"
          >
            <span className="hidden sm:inline">{copy.reduire}</span>
            <ChevronDown size={16} />
          </button>
        </div>
        <p className="mt-1 text-sm text-amber-100/80">{copy.body}</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {/* Sur un téléphone la liste peut être longue : on la borne et on la
              fait défiler plutôt que de repousser le site hors de l'écran. */}
          <ul className="flex max-h-24 min-w-0 flex-wrap gap-2 overflow-y-auto sm:max-h-none">
            {missing.map((b) => (
              <li
                key={b}
                className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs text-amber-100"
              >
                {labels[b] ?? b}
              </li>
            ))}
          </ul>
          <Link
            href={`/configure?session=${session.id}&step=4`}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-amber-400"
          >
            <Pencil size={14} /> {copy.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
