import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

/*
  2026-09-13 — deux façons de facturer ou de harceler un client à tort.

  1. Un domaine « déjà pris » restait achetable.

     `ChoixDomaine` affichait « déjà pris » à droite de la ligne et laissait
     le bouton actif. `choisir()` ne refusait que `prix === null`. Un clic
     posait le nom dans le panier, et le client payait 29 € pour un domaine
     que personne ne pourrait jamais lui enregistrer.

  2. Un client qui venait de payer recevait « pas encore finalisé ».

     La relance à 48 h écarte une session si `paid/<sessionId>.json` existe.
     Or `POST /api/sessions` tire un identifiant NEUF à chaque passage dans
     l'assistant : le même acheteur laisse plusieurs sessions complètes
     derrière lui, en paie une, et les autres le relancent deux jours plus
     tard. On marque donc aussi le client, par empreinte de son email.

     Le marqueur était en plus écrit APRÈS les emails de commande : une erreur
     d'envoi Resend sortait du bloc avant lui, et la relance repartait.
*/

const RACINE = join(__dirname, "..", "..");
const lire = (...p: string[]) => readFileSync(join(RACINE, ...p), "utf8");

const CHOIX_DOMAINE = lire("components", "wizard", "ChoixDomaine.tsx");
const API_DOMAINES = lire("app", "api", "domains", "route.ts");
const WEBHOOK = lire("app", "api", "webhook", "route.ts");
const CRON = lire("app", "api", "cron", "preview-reminder", "route.ts");

describe("Un domaine déjà pris n'est ni cliquable ni facturable", () => {
  it("le garde-fou porte sur la disponibilité, pas seulement sur le prix", () => {
    expect(CHOIX_DOMAINE).toContain("v.prix !== null && v.libre !== false");
    expect(CHOIX_DOMAINE).toContain("if (!selectionnable(v)) return;");
  });

  it("le bouton est réellement désactivé, pas seulement grisé", () => {
    expect(CHOIX_DOMAINE).toContain("disabled={pris}");
  });

  it("un choix devenu indisponible est retiré du panier", () => {
    // Le client retient un nom, continue à taper, la vérification revient
    // « pris » : sans ce retrait, le nom reste facturé.
    expect(CHOIX_DOMAINE).toContain("if (correspondante && !selectionnable(correspondante)) onChange(null)");
  });

  it("les alternatives proposées sont libres", () => {
    expect(API_DOMAINES).toContain('v.prix !== null && v.libre !== false');
  });

  it("une disponibilité INCONNUE reste sélectionnable — on ne bloque pas sur une panne tierce", () => {
    // `libre === null` = le service n'a pas répondu. L'écran le dit, et on
    // confirme avant enregistrement. Bloquer là-dessus fermerait la vente
    // chaque fois que Netim tousse.
    expect(CHOIX_DOMAINE).toContain("v.libre !== false");
    expect(CHOIX_DOMAINE).not.toContain("v.libre === true");
  });
});

describe("Une relance ne part jamais vers un client qui a payé", () => {
  it("le webhook marque la commande ET le client", () => {
    expect(WEBHOOK).toContain("marquerPaye({ sessionId: meta.sessionId, email: clientEmail })");
  });

  it("le marqueur est posé AVANT les emails", () => {
    const marqueur = WEBHOOK.indexOf("await marquerPaye(");
    const emails = WEBHOOK.indexOf("const emailPromises = []");
    expect(marqueur).toBeGreaterThan(-1);
    expect(marqueur).toBeLessThan(emails);
  });

  it("l'ancien marqueur écrit en fin de bloc a disparu", () => {
    expect(WEBHOOK).not.toContain("put(`paid/${meta.sessionId}.json`");
  });

  it("un marqueur incomplet est journalisé, pas avalé", () => {
    expect(WEBHOOK).toContain("relance possible à tort");
  });

  it("le cron écarte sur l'empreinte de l'email, pas seulement sur l'identifiant", () => {
    expect(CRON).toContain("acheteurs.has(empreinteEmail(data.formData.email))");
  });

  it("le cron écarte AVANT de calculer l'âge — sinon rien ne change pour un client payant", () => {
    const parEmail = CRON.indexOf("acheteurs.has(empreinteEmail");
    const envoi = CRON.indexOf("await resend.emails.send");
    expect(parEmail).toBeGreaterThan(-1);
    expect(parEmail).toBeLessThan(envoi);
  });
});

describe("L'empreinte du client", () => {
  it("normalise casse et espaces — le même client, écrit de deux façons", async () => {
    const { empreinteEmail } = await import("../paiement-marqueurs");

    expect(empreinteEmail("  Client@Exemple.FR ")).toBe(empreinteEmail("client@exemple.fr"));
  });

  it("n'expose pas l'email en clair — le bucket est public à chemin prévisible", async () => {
    const { empreinteEmail } = await import("../paiement-marqueurs");

    const empreinte = empreinteEmail("client@exemple.fr");
    expect(empreinte).toMatch(/^[0-9a-f]{64}$/);
    expect(empreinte).not.toContain("client");
    expect(empreinte).not.toContain("exemple");
  });

  it("le marqueur stocké ne porte aucune donnée personnelle", () => {
    const source = lire("lib", "paiement-marqueurs.ts");
    const corps = source.slice(source.indexOf("const corps ="), source.indexOf("const options"));
    expect(corps).toContain("paidAt");
    expect(corps).not.toContain("email");
  });
});

describe("marquerPaye ne fait jamais échouer une commande", () => {
  beforeEach(() => vi.resetModules());

  it("un stockage en panne rend l'échec au lieu de lever", async () => {
    vi.doMock("@vercel/blob", () => ({
      put: vi.fn().mockRejectedValue(new Error("Blob indisponible")),
      list: vi.fn().mockResolvedValue({ blobs: [], cursor: undefined }),
    }));
    const { marquerPaye } = await import("../paiement-marqueurs");

    const res = await marquerPaye({ sessionId: "s-1", email: "client@exemple.fr" });

    expect(res).toEqual({ commande: false, client: false });
  });

  it("sans email, la commande est quand même marquée", async () => {
    const put = vi.fn().mockResolvedValue({});
    vi.doMock("@vercel/blob", () => ({
      put,
      list: vi.fn().mockResolvedValue({ blobs: [], cursor: undefined }),
    }));
    const { marquerPaye } = await import("../paiement-marqueurs");

    const res = await marquerPaye({ sessionId: "s-2", email: null });

    expect(res).toEqual({ commande: true, client: false });
    expect(put).toHaveBeenCalledTimes(1);
    expect(put.mock.calls[0][0]).toBe("paid/s-2.json");
  });

  it("les deux marqueurs portent des chemins distincts et stables", async () => {
    const put = vi.fn().mockResolvedValue({});
    vi.doMock("@vercel/blob", () => ({
      put,
      list: vi.fn().mockResolvedValue({ blobs: [], cursor: undefined }),
    }));
    const { marquerPaye, empreinteEmail } = await import("../paiement-marqueurs");

    await marquerPaye({ sessionId: "s-3", email: "client@exemple.fr" });

    const chemins = put.mock.calls.map((c) => c[0]).sort();
    expect(chemins).toEqual(
      ["paid-emails/" + empreinteEmail("client@exemple.fr") + ".json", "paid/s-3.json"].sort(),
    );
    // addRandomSuffix false, sinon le cron ne retrouve jamais le marqueur.
    expect(put.mock.calls[0][2]).toMatchObject({ addRandomSuffix: false });
  });

  it("clientsPayants suit les curseurs — au-delà de 1000 acheteurs on n'en oublie pas", async () => {
    const list = vi
      .fn()
      .mockResolvedValueOnce({ blobs: [{ pathname: "paid-emails/aaa.json" }], cursor: "suite" })
      .mockResolvedValueOnce({ blobs: [{ pathname: "paid-emails/bbb.json" }], cursor: undefined });
    vi.doMock("@vercel/blob", () => ({ put: vi.fn(), list }));
    const { clientsPayants } = await import("../paiement-marqueurs");

    const acheteurs = await clientsPayants();

    expect(acheteurs).toEqual(new Set(["aaa", "bbb"]));
  });
});
