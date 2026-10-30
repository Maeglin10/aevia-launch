"use client";

/**
 * Le panier d'une boutique cliente.
 *
 * Deux décisions qui tiennent tout le reste :
 *
 * 1. **Le panier ne contient que des index et des quantités.** Pas de nom, pas
 *    de prix. C'est exactement ce que `POST /api/boutique/checkout` attend, et
 *    c'est pour ça qu'un client qui rejoue la requête avec « prix : 1 centime »
 *    n'a aucun levier : le serveur relit le catalogue du marchand.
 * 2. **L'état est rangé par `sessionId`.** Un même navigateur peut visiter deux
 *    boutiques générées par Aevia ; une clé partagée ferait apparaître les
 *    articles de l'une dans l'autre, avec des index qui ne désignent plus rien.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  MAX_LIGNES,
  MAX_QUANTITE,
  type LignePanier,
  type ProduitBoutique,
  achetableEnLigne,
  totalEnCents,
} from "@/lib/boutique/prix";

interface Panier {
  lignes: LignePanier[];
  nombreArticles: number;
  totalCents: number;
  ajouter: (produitIndex: number, quantite?: number) => void;
  definirQuantite: (produitIndex: number, quantite: number) => void;
  retirer: (produitIndex: number) => void;
  vider: () => void;
  ouvert: boolean;
  setOuvert: (v: boolean) => void;
  /** `undefined` = aucun envoi en cours ; une chaîne = le message d'erreur à montrer. */
  erreur?: string;
  enCours: boolean;
  payer: () => Promise<void>;
  produits: ProduitBoutique[];
  achetable: (produitIndex: number) => boolean;
}

const Ctx = createContext<Panier | null>(null);

/**
 * `usePanier` rend `null` quand aucun fournisseur n'est monté — c'est le cas
 * normal d'une vitrine sans paiement. Un composant d'achat doit donc tester, et
 * ne rien afficher plutôt que de planter la page du marchand.
 */
export function usePanier(): Panier | null {
  return useContext(Ctx);
}

const cle = (sessionId: string) => `aevia:panier:${sessionId}`;

function lireStockage(sessionId: string): LignePanier[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(cle(sessionId));
    if (!brut) return [];
    const lu: unknown = JSON.parse(brut);
    if (!Array.isArray(lu)) return [];
    // On ne fait pas confiance à ce qu'on relit : un localStorage se modifie à
    // la main, et un index hors catalogue ferait échouer le paiement sans que
    // le client comprenne pourquoi.
    return lu
      .filter(
        (l): l is LignePanier =>
          !!l &&
          typeof l === "object" &&
          Number.isInteger((l as LignePanier).produitIndex) &&
          (l as LignePanier).produitIndex >= 0 &&
          Number.isInteger((l as LignePanier).quantite) &&
          (l as LignePanier).quantite >= 1 &&
          (l as LignePanier).quantite <= MAX_QUANTITE,
      )
      .slice(0, MAX_LIGNES);
  } catch {
    return [];
  }
}

export function PanierProvider({
  sessionId,
  produits,
  children,
}: {
  sessionId: string;
  produits: ProduitBoutique[];
  children: React.ReactNode;
}) {
  const [lignes, setLignes] = useState<LignePanier[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState<string | undefined>();
  const [enCours, setEnCours] = useState(false);

  // Relecture après le premier rendu : le serveur ne connaît pas le
  // localStorage, et lire pendant le rendu ferait diverger l'hydratation.
  useEffect(() => {
    setLignes(lireStockage(sessionId).filter((l) => l.produitIndex < produits.length));
  }, [sessionId, produits.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(cle(sessionId), JSON.stringify(lignes));
    } catch {
      // Navigation privée, quota plein : le panier reste en mémoire pour cette
      // visite. Perdre le panier au rechargement vaut mieux que planter.
    }
  }, [sessionId, lignes]);

  const achetable = useCallback(
    (i: number) => {
      const p = produits[i];
      return !!p && achetableEnLigne(p);
    },
    [produits],
  );

  const ajouter = useCallback(
    (produitIndex: number, quantite = 1) => {
      if (!achetable(produitIndex)) return;
      setErreur(undefined);
      setLignes((actuel) => {
        const existante = actuel.find((l) => l.produitIndex === produitIndex);
        if (existante) {
          return actuel.map((l) =>
            l.produitIndex === produitIndex
              ? { ...l, quantite: Math.min(MAX_QUANTITE, l.quantite + quantite) }
              : l,
          );
        }
        if (actuel.length >= MAX_LIGNES) return actuel;
        return [...actuel, { produitIndex, quantite: Math.min(MAX_QUANTITE, Math.max(1, quantite)) }];
      });
      setOuvert(true);
    },
    [achetable],
  );

  const definirQuantite = useCallback((produitIndex: number, quantite: number) => {
    setLignes((actuel) =>
      quantite < 1
        ? actuel.filter((l) => l.produitIndex !== produitIndex)
        : actuel.map((l) =>
            l.produitIndex === produitIndex
              ? { ...l, quantite: Math.min(MAX_QUANTITE, quantite) }
              : l,
          ),
    );
  }, []);

  const retirer = useCallback((produitIndex: number) => {
    setLignes((actuel) => actuel.filter((l) => l.produitIndex !== produitIndex));
  }, []);

  const vider = useCallback(() => setLignes([]), []);

  const payer = useCallback(async () => {
    if (lignes.length === 0 || enCours) return;
    setEnCours(true);
    setErreur(undefined);
    try {
      const res = await fetch("/api/boutique/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, lignes }),
      });
      const corps = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !corps.url) {
        setErreur(corps.error ?? "Le paiement n'a pas pu démarrer. Réessayez dans un instant.");
        return;
      }
      // On ne vide PAS le panier ici : le client peut revenir en arrière depuis
      // Stripe sans avoir payé, et retrouver un panier vide le ferait repartir
      // de zéro. Le vidage se fait au retour sur la page de succès.
      window.location.href = corps.url;
    } catch {
      setErreur("Connexion interrompue. Vérifiez votre réseau et réessayez.");
    } finally {
      setEnCours(false);
    }
  }, [lignes, sessionId, enCours]);

  const valeur = useMemo<Panier>(
    () => ({
      lignes,
      nombreArticles: lignes.reduce((n, l) => n + l.quantite, 0),
      totalCents: totalEnCents(lignes, produits),
      ajouter,
      definirQuantite,
      retirer,
      vider,
      ouvert,
      setOuvert,
      erreur,
      enCours,
      payer,
      produits,
      achetable,
    }),
    [lignes, produits, ajouter, definirQuantite, retirer, vider, ouvert, erreur, enCours, payer, achetable],
  );

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}
