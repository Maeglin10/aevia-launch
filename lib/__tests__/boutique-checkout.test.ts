import { describe, it, expect, vi, beforeEach } from "vitest";

/*
  Le parcours d'achat, éprouvé sur ce qui est À NOUS.

  Pourquoi un test et pas une vérification manuelle : ce chantier a dû être
  repris trois fois. Une vérification manuelle prouve que ça marche aujourd'hui ;
  un test empêche que ça casse demain. Ce qui se casse ici n'est pas visible à
  l'œil — un index décalé d'un cran envoie le mauvais produit en cuisine du
  commerce, et le client paie le bon prix pour le mauvais article.

  Stripe est remplacé : on vérifie CE QU'ON LUI ENVOIE. Ce que Stripe en fait
  est son contrat, pas le nôtre, et appeler le vrai service exigerait un compte
  Connect réel — une dépendance qui rendrait le test non reproductible.
*/

const creerSession = vi.fn();
vi.mock("stripe", () => ({
  default: class {
    checkout = { sessions: { create: creerSession } };
  },
}));

const lireSession = vi.fn();
vi.mock("@/lib/sessions", () => ({ getSessionFromBlob: lireSession }));

const boutique = (o: Record<string, unknown> = {}) => ({
  id: "sess-1",
  formData: { template: "ecommerce" },
  businessProfile: {
    commerce: { stripeAccountId: "acct_marchand" },
    products: [
      { name: "Bougie", price: "19,90", description: "Cire de soja" },
      { name: "Savon", price: "8" },
      { name: "Coffret", price: "sur devis" },
      { name: "Rupture", price: "12", stock: 0 },
    ],
    ...o,
  },
});

async function appeler(corps: unknown, session: unknown = boutique()) {
  lireSession.mockResolvedValue(session);
  const { POST } = await import("../../app/api/boutique/checkout/route");
  const req = {
    json: async () => corps,
    headers: { get: () => "https://boutique.test" },
  } as unknown as Parameters<typeof POST>[0];
  const res = await POST(req);
  return { statut: res.status, corps: (await res.json()) as Record<string, unknown> };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.STRIPE_SECRET_KEY = "sk_test_factice";
  creerSession.mockResolvedValue({ url: "https://checkout.stripe.com/c/pay/cs_test_x" });
});

describe("parcours d'achat d'une boutique cliente", () => {
  it("l'index du panier désigne le bon produit, au bon prix du CATALOGUE", async () => {
    const { statut, corps } = await appeler({
      sessionId: "sess-1",
      lignes: [{ produitIndex: 0, quantite: 2 }, { produitIndex: 1, quantite: 1 }],
    });
    expect(statut).toBe(200);
    expect(corps.url).toContain("checkout.stripe.com");

    const [params, options] = creerSession.mock.calls[0];
    expect(params.line_items).toEqual([
      {
        quantity: 2,
        price_data: {
          currency: "eur",
          unit_amount: 1990,
          product_data: { name: "Bougie", description: "Cire de soja" },
        },
      },
      {
        quantity: 1,
        price_data: { currency: "eur", unit_amount: 800, product_data: { name: "Savon" } },
      },
    ]);
    // L'argent va au marchand, pas à la plateforme.
    expect(options).toEqual({ stripeAccount: "acct_marchand" });
  });

  it("un prix envoyé par le navigateur est IGNORÉ — c'est la garantie anti-rejeu", async () => {
    await appeler({
      sessionId: "sess-1",
      // Un client malveillant rejoue la requête en y glissant un prix.
      lignes: [{ produitIndex: 0, quantite: 1, prix: 1, unit_amount: 1 }],
    });
    const [params] = creerSession.mock.calls[0];
    expect(params.line_items[0].price_data.unit_amount).toBe(1990);
  });

  it("les métadonnées portent de quoi reconstituer la commande au webhook", async () => {
    await appeler({ sessionId: "sess-1", lignes: [{ produitIndex: 1, quantite: 3 }] });
    const [params] = creerSession.mock.calls[0];
    expect(params.metadata.aevia_session_id).toBe("sess-1");
    expect(JSON.parse(params.metadata.lignes)).toEqual([{ i: 1, q: 3 }]);
  });

  it("les frais de livraison s'ajoutent en ligne séparée quand le marchand en déclare", async () => {
    const s = boutique();
    s.businessProfile.commerce = { stripeAccountId: "acct_marchand", fraisLivraisonCents: 490 } as never;
    await appeler({ sessionId: "sess-1", lignes: [{ produitIndex: 1, quantite: 1 }] }, s);
    const [params] = creerSession.mock.calls[0];
    expect(params.line_items.at(-1)).toEqual({
      quantity: 1,
      price_data: { currency: "eur", unit_amount: 490, product_data: { name: "Livraison" } },
    });
  });

  it("un produit sans prix ferme est refusé, et AUCUNE session n'est créée", async () => {
    const { statut } = await appeler({ sessionId: "sess-1", lignes: [{ produitIndex: 2, quantite: 1 }] });
    expect(statut).toBe(400);
    expect(creerSession).not.toHaveBeenCalled();
  });

  it("stock insuffisant : refusé en 409, rien n'est encaissé", async () => {
    const { statut, corps } = await appeler({
      sessionId: "sess-1",
      lignes: [{ produitIndex: 3, quantite: 1 }],
    });
    expect(statut).toBe(409);
    expect(String(corps.error)).toContain("Rupture");
    expect(creerSession).not.toHaveBeenCalled();
  });

  it("une boutique sans compte Stripe ne peut pas encaisser : 409, pas une erreur obscure", async () => {
    const s = boutique();
    s.businessProfile.commerce = {} as never;
    const { statut } = await appeler({ sessionId: "sess-1", lignes: [{ produitIndex: 0, quantite: 1 }] }, s);
    expect(statut).toBe(409);
    expect(creerSession).not.toHaveBeenCalled();
  });

  it("index inconnu, quantité hors bornes, panier vide ou démesuré : tout est refusé", async () => {
    for (const lignes of [
      [{ produitIndex: 99, quantite: 1 }],
      [{ produitIndex: 0, quantite: 0 }],
      [{ produitIndex: 0, quantite: 100 }],
      [],
      Array.from({ length: 51 }, () => ({ produitIndex: 0, quantite: 1 })),
    ]) {
      const { statut } = await appeler({ sessionId: "sess-1", lignes });
      expect(statut).toBeGreaterThanOrEqual(400);
    }
    expect(creerSession).not.toHaveBeenCalled();
  });

  it("boutique introuvable : 404 et aucun appel à Stripe", async () => {
    const { statut } = await appeler({ sessionId: "inconnue", lignes: [{ produitIndex: 0, quantite: 1 }] }, null);
    expect(statut).toBe(404);
    expect(creerSession).not.toHaveBeenCalled();
  });
});
