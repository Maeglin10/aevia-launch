"use client";

/*
  L'étape métier des cinq archétypes qui n'en avaient pas.

  Onze niches sur soixante-huit menaient à une étape dédiée — rendez-vous,
  restauration, immobilier. Les cinquante-sept autres tombaient sur le
  formulaire commun, qui ne demande ni le portfolio d'un architecte, ni les
  zones d'intervention d'un serrurier, ni la grille d'honoraires d'un avocat.
  Leur site gardait donc les sections du thème, faute d'avoir rien à mettre
  dedans.

  Plutôt que cinq formulaires écrits à la main, celui-ci lit la déclaration de
  l'archétype — `ARCHETYPES[x].catalogueFields` et `coreFields` — et rend le
  champ correspondant. Ajouter un champ à un archétype suffit à le faire
  apparaître ici.
*/

import { useState } from "react";
import { blocksForTheme } from "@/lib/templates/capabilities";
import { Plus, X } from "lucide-react";
import type { BusinessProfile } from "@/lib/sessions";
import { ARCHETYPES, type ArchetypeId } from "@/lib/wizard/archetypes";
import { useAutoSaveStep } from "@/components/wizard/useAutoSaveStep";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const input =
  "px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-red-500 transition-colors";
const label = "text-xs font-semibold tracking-wide text-zinc-400 uppercase";

// Ce que chaque champ demande, dit avec les mots du métier plutôt que ceux du
// schéma : un architecte parle de réalisations, pas de `beforeAfter`.
const LIBELLES: Record<string, { titre: string; aide: string }> = {
  services: { titre: "Vos prestations", aide: "Ce que vous vendez, avec le prix si vous l'affichez." },
  products: { titre: "Vos produits", aide: "Les pièces ou articles que vous proposez." },
  team: { titre: "Votre équipe", aide: "Qui travaille avec vous, et à quel poste." },
  beforeAfter: { titre: "Vos réalisations", aide: "Un avant/après, ou simplement une photo et sa légende." },
  listings: { titre: "Vos biens", aide: "Ce que vous avez au catalogue." },
  menu: { titre: "Votre carte", aide: "Vos plats, par catégorie." },
  commerce: { titre: "Votre boutique", aide: "Le lien vers votre boutique en ligne, si vous en avez une." },
  openingHours: { titre: "Vos horaires", aide: "Laissez vide un jour de fermeture." },
  geo: { titre: "Adresse et zones", aide: "Où vous êtes, et jusqu'où vous vous déplacez." },
  faq: { titre: "Questions fréquentes", aide: "Ce qu'on vous demande le plus souvent." },
  keyStats: { titre: "Vos chiffres", aide: "Années d'expérience, chantiers livrés, clients suivis." },
  certifications: { titre: "Labels et certifications", aide: "Une par ligne." },
  reputation: { titre: "Vos avis clients", aide: "Recopiez-en deux ou trois, tels qu'ils ont été écrits." },
  bookingSystem: { titre: "Réservation en ligne", aide: "Le lien vers votre agenda, si vous en avez un." },
  emergency: { titre: "Urgences", aide: "Le numéro à appeler en dehors des heures d'ouverture." },
  paymentMethods: { titre: "Moyens de paiement", aide: "Un par ligne." },
};

export function ArchetypeStep({
  archetype,
  value,
  onChange,
  sessionId,
  templateId,
}: {
  archetype: ArchetypeId;
  value: BusinessProfile | undefined;
  onChange: (bp: BusinessProfile) => void;
  sessionId?: string | null;
  /** Le thème choisi : l'étape ne montre que les sections qu'il sait afficher. */
  templateId?: string;
}) {
  const [bp, setBp] = useState<BusinessProfile>(value ?? {});
  useAutoSaveStep(sessionId ?? null, "businessProfile", bp);

  function maj(patch: Partial<BusinessProfile>) {
    const suivant = { ...bp, ...patch };
    setBp(suivant);
    onChange(suivant);
  }

  const config = ARCHETYPES[archetype];
  /*
    Le thème choisi ne rend qu'une partie des blocs : demander le reste fait
    perdre du temps au client pour des données que sa page n'affichera pas.
    On filtre donc les champs par la déclaration du thème. Les champs
    d'infrastructure (réservation, adresse, paiement) restent toujours.
  */
  /*
    Un champ nourrit parfois PLUSIEURS blocs : les thèmes servent la carte ou
    le catalogue dans leur section « prestations » quand il n'y a pas de
    prestations (cascade clientServices), et les biens en « réalisations ».
    Filtrer sur le seul bloc du champ privait une bijouterie, sur un thème à
    prestations, de toute saisie de son offre.
  */
  const CHAMP_BLOC: Record<string, string[]> = {
    services: ["prestations"], menu: ["menu", "prestations"],
    products: ["produits", "prestations"],
    team: ["equipe"], beforeAfter: ["realisations"], openingHours: ["horaires"],
    reputation: ["avis"], certifications: ["engagements"], keyStats: ["chiffres"],
    faq: ["faq"], methode: ["methode"], listings: ["realisations", "prestations"],
  };
  const blocsTheme = blocksForTheme(templateId);
  const garde = (champ: string) => {
    const blocs = CHAMP_BLOC[champ];
    return !blocs || !templateId || blocs.some((b) => blocsTheme.includes(b as never));
  };
  const champs = ([...config.catalogueFields, ...config.coreFields] as string[]).filter(garde);

  // Une liste d'objets : on ajoute, on retire, on saisit.
  // `poser` transforme la liste en patch quand elle ne vit pas à la racine du
  // profil (les avis vivent dans reputation.featuredReviews : écrire le
  // tableau dans `reputation` même donnait une donnée qu'aucun thème ne lit).
  function listeObjets<T extends Record<string, any>>(
    cle: string,
    rows: T[],
    vide: T,
    colonnes: { champ: keyof T; placeholder: string; largeur?: string }[],
    poser?: (rows: T[]) => Partial<BusinessProfile>,
  ) {
    const patchDe = (suivant: T[]) =>
      poser ? poser(suivant) : ({ [cle]: suivant } as Partial<BusinessProfile>);
    return (
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-start">
            {colonnes.map((col) => (
              <input
                key={String(col.champ)}
                className={`${input} ${col.largeur ?? "flex-1"}`}
                placeholder={col.placeholder}
                value={(row[col.champ] as string) ?? ""}
                onChange={(e) => {
                  const suivant = rows.map((r, k) =>
                    k === i ? { ...r, [col.champ]: e.target.value } : r,
                  );
                  maj(patchDe(suivant));
                }}
              />
            ))}
            <button
              type="button"
              aria-label="Retirer"
              className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
              onClick={() => maj(patchDe(rows.filter((_, k) => k !== i)))}
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          onClick={() => maj(patchDe([...rows, vide]))}
        >
          <Plus size={14} /> Ajouter
        </button>
      </div>
    );
  }

  // Une liste de mots, une par ligne : plus simple à remplir qu'un tableau.
  function listeMots(cle: string, rows: string[], placeholder: string) {
    return (
      <textarea
        rows={3}
        className={`${input} w-full resize-none`}
        placeholder={placeholder}
        value={rows.join("\n")}
        onChange={(e) =>
          maj({
            [cle]: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
          } as Partial<BusinessProfile>)
        }
      />
    );
  }

  function rendre(champ: string) {
    switch (champ) {
      case "services":
        return listeObjets("services", bp.services ?? [], { name: "" }, [
          { champ: "name", placeholder: "Prestation" },
          { champ: "price", placeholder: "Prix", largeur: "w-28" },
          { champ: "description", placeholder: "En une phrase" },
        ]);
      case "products":
        return listeObjets("products", bp.products ?? [], { name: "" }, [
          { champ: "name", placeholder: "Produit" },
          { champ: "price", placeholder: "Prix", largeur: "w-28" },
          { champ: "description", placeholder: "En une phrase" },
        ]);
      case "team":
        return listeObjets("team", bp.team ?? [], { name: "", role: "" }, [
          { champ: "name", placeholder: "Prénom et nom" },
          { champ: "role", placeholder: "Poste" },
        ]);
      case "beforeAfter":
        return listeObjets("beforeAfter", bp.beforeAfter ?? [], { beforeUrl: "", afterUrl: "" }, [
          { champ: "caption", placeholder: "Légende" },
          { champ: "beforeUrl", placeholder: "Photo avant (lien)" },
          { champ: "afterUrl", placeholder: "Photo après (lien)" },
        ]);
      case "listings":
        return listeObjets("listings", bp.listings ?? [], { title: "" }, [
          { champ: "title", placeholder: "Bien" },
          { champ: "price", placeholder: "Prix", largeur: "w-28" },
          { champ: "surface", placeholder: "Surface", largeur: "w-24" },
        ]);
      case "menu":
        return listeObjets("menu", bp.menu ?? [], { category: "", name: "" }, [
          { champ: "category", placeholder: "Catégorie", largeur: "w-32" },
          { champ: "name", placeholder: "Plat" },
          { champ: "price", placeholder: "Prix", largeur: "w-24" },
        ]);
      case "faq":
        return listeObjets("faq", bp.faq ?? [], { q: "", a: "" }, [
          { champ: "q", placeholder: "Question" },
          { champ: "a", placeholder: "Réponse" },
        ]);
      case "keyStats":
        return listeObjets("keyStats", bp.keyStats ?? [], { value: "", label: "" }, [
          { champ: "value", placeholder: "12", largeur: "w-24" },
          { champ: "label", placeholder: "Années d'expérience" },
        ]);
      case "certifications":
        return listeMots("certifications", bp.certifications ?? [], "RGE\nQualibat\nGarantie décennale");
      case "paymentMethods":
        return listeMots("paymentMethods", bp.paymentMethods ?? [], "Carte bancaire\nEspèces\nVirement");
      case "reputation":
        return listeObjets(
          "reputation" as string,
          (bp.reputation?.featuredReviews ?? []) as any[],
          { author: "", text: "", rating: 5 } as any,
          [
            { champ: "author" as any, placeholder: "Prénom", largeur: "w-32" },
            { champ: "text" as any, placeholder: "Ce qu'il ou elle a écrit" },
          ],
          (rows) => {
            /* Un profil passé par l'ancien bug peut porter un tableau brut :
               on repart d'un objet sain plutôt que d'étaler ses indices. */
            const rep = bp.reputation && !Array.isArray(bp.reputation) ? bp.reputation : {};
            return { reputation: { ...rep, featuredReviews: rows } };
          },
        );
      case "openingHours": {
        type Heure = NonNullable<BusinessProfile["openingHours"]>[number];
        const heures: Heure[] = bp.openingHours ?? DAYS.map((day) => ({ day, closed: false }) as Heure);
        return (
          <div className="space-y-1.5">
            {heures.map((h, i) => (
              <div key={h.day} className="flex items-center gap-2">
                <span className="w-24 text-xs text-zinc-400">{h.day}</span>
                <input
                  className={`${input} w-24`}
                  placeholder="09:00"
                  value={h.open ?? ""}
                  onChange={(e) =>
                    maj({ openingHours: heures.map((x, k) => (k === i ? { ...x, open: e.target.value } : x)) })
                  }
                />
                <input
                  className={`${input} w-24`}
                  placeholder="18:00"
                  value={h.close ?? ""}
                  onChange={(e) =>
                    maj({ openingHours: heures.map((x, k) => (k === i ? { ...x, close: e.target.value } : x)) })
                  }
                />
                <label className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <input
                    type="checkbox"
                    checked={Boolean(h.closed)}
                    onChange={(e) =>
                      maj({ openingHours: heures.map((x, k) => (k === i ? { ...x, closed: e.target.checked } : x)) })
                    }
                  />
                  fermé
                </label>
              </div>
            ))}
          </div>
        );
      }
      case "geo":
        return (
          <div className="space-y-2">
            <input
              className={`${input} w-full`}
              placeholder="12 rue des Lilas, 74000 Annecy"
              value={bp.geo?.address ?? ""}
              onChange={(e) => maj({ geo: { ...bp.geo, address: e.target.value } })}
            />
            <textarea
              rows={2}
              className={`${input} w-full resize-none`}
              placeholder="Zones desservies, une par ligne"
              value={(bp.geo?.serviceAreas ?? []).join("\n")}
              onChange={(e) =>
                maj({
                  geo: {
                    ...bp.geo,
                    serviceAreas: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                  },
                })
              }
            />
          </div>
        );
      case "bookingSystem":
        return (
          <input
            className={`${input} w-full`}
            placeholder="https://…"
            value={bp.bookingSystem?.url ?? ""}
            onChange={(e) => maj({ bookingSystem: { ...bp.bookingSystem, url: e.target.value } })}
          />
        );
      case "emergency":
        return (
          <div className="flex gap-2">
            <input
              className={`${input} w-40`}
              placeholder="06 12 34 56 78"
              value={bp.emergency?.phone ?? ""}
              onChange={(e) =>
                maj({ emergency: { enabled: true, ...bp.emergency, phone: e.target.value } })
              }
            />
            <input
              className={`${input} flex-1`}
              placeholder="7j/7, 24h/24"
              value={bp.emergency?.note ?? ""}
              onChange={(e) =>
                maj({ emergency: { enabled: true, ...bp.emergency, note: e.target.value } })
              }
            />
          </div>
        );
      case "commerce":
        return (
          <input
            className={`${input} w-full`}
            placeholder="https://votre-boutique…"
            value={bp.commerce?.storeUrl ?? ""}
            onChange={(e) => maj({ commerce: { mode: "external", ...bp.commerce, storeUrl: e.target.value } })}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      {champs.map((champ) => {
        const rendu = rendre(champ);
        if (!rendu) return null;
        const l = LIBELLES[champ] ?? { titre: champ, aide: "" };
        return (
          <div key={champ}>
            <div className={label}>{l.titre}</div>
            {l.aide && <p className="text-[11px] text-zinc-500 mt-0.5 mb-2">{l.aide}</p>}
            {rendu}
          </div>
        );
      })}
      <p className="text-[11px] text-zinc-600 leading-relaxed">
        Rien n'est obligatoire. Ce que vous laissez vide garde le contenu du thème.
      </p>
    </div>
  );
}
