import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSessionFromBlob, saveSessionToBlob } from "@/lib/sessions";

export const runtime = "nodejs";

/*
  Retour de l'OAuth Stripe Connect : le code s'échange contre le
  stripe_user_id du marchand, qu'on écrit dans sa session. Le `state` reprend
  session + jeton d'édition — même exigence qu'au départ, un state forgé sans
  jeton valide ne peut rien écrire.
*/
export async function GET(req: NextRequest) {
  const origine = process.env.NEXT_PUBLIC_BASE_URL ?? "https://aevia-launch.vercel.app";
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state") ?? "";
  const [sessionId, token] = state.split(":");

  const versSite = (suffixe: string) => {
    const session_ = sessionId ? `?session=${sessionId}${suffixe}` : "";
    return NextResponse.redirect(`${origine}/boutique/connexion-terminee${session_}`);
  };

  if (!code || !sessionId || !token || !process.env.STRIPE_SECRET_KEY) {
    return versSite("&etat=echec");
  }
  const session = await getSessionFromBlob(sessionId);
  if (!session || !session.editToken || session.editToken !== token) {
    return versSite("&etat=echec");
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const reponse = await stripe.oauth.token({ grant_type: "authorization_code", code });
    const compte = reponse.stripe_user_id;
    if (!compte) return versSite("&etat=echec");

    session.businessProfile = session.businessProfile ?? {};
    session.businessProfile.commerce = {
      ...(session.businessProfile.commerce ?? { mode: "stripe" as const }),
      mode: "stripe",
      stripeAccountId: compte,
    };
    await saveSessionToBlob(sessionId, session);
    return versSite("&etat=ok");
  } catch {
    return versSite("&etat=echec");
  }
}
