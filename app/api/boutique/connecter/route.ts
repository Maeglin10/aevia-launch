import { NextRequest, NextResponse } from "next/server";
import { getSessionFromBlob } from "@/lib/sessions";

export const runtime = "nodejs";

/*
  Départ de l'onboarding Stripe Connect du marchand.

  Seul le détenteur du jeton d'édition de la session peut relier un compte :
  sans cela, n'importe qui connaîtrait l'URL d'aperçu pourrait détourner les
  encaissements d'une boutique vers son propre Stripe.

  Le `state` OAuth porte session + jeton et revient signé par Stripe sur
  /api/boutique/connecter/retour.
*/
export async function GET(req: NextRequest) {
  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID;
  if (!clientId) return NextResponse.json({ error: "Connect non configuré" }, { status: 503 });

  const sessionId = req.nextUrl.searchParams.get("session");
  const token = req.nextUrl.searchParams.get("token");
  if (!sessionId || !token) return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });

  const session = await getSessionFromBlob(sessionId);
  if (!session) return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
  if (!session.editToken || session.editToken !== token) {
    return NextResponse.json({ error: "Jeton invalide" }, { status: 403 });
  }

  const origine = process.env.NEXT_PUBLIC_BASE_URL ?? "https://aevia-launch.vercel.app";
  const url = new URL("https://connect.stripe.com/oauth/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", "read_write");
  url.searchParams.set("state", `${sessionId}:${token}`);
  url.searchParams.set("redirect_uri", `${origine}/api/boutique/connecter/retour`);
  if (session.formData?.email) url.searchParams.set("stripe_user[email]", session.formData.email);

  return NextResponse.redirect(url.toString());
}
