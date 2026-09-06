import { NextRequest, NextResponse } from "next/server";
import { getSessionFromBlob } from "@/lib/sessions";
import { listerCommandes } from "@/lib/boutique/commandes";

export const runtime = "nodejs";

/*
  Les commandes d'un marchand — servies au seul détenteur du jeton d'édition :
  elles portent noms et adresses d'acheteurs, rien à exposer au premier venu
  qui connaîtrait l'identifiant de session.
*/
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");
  const token = req.nextUrl.searchParams.get("token") ?? req.headers.get("x-edit-token");
  if (!sessionId || !token) return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });

  const session = await getSessionFromBlob(sessionId);
  if (!session) return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
  if (!session.editToken || session.editToken !== token) {
    return NextResponse.json({ error: "Jeton invalide" }, { status: 403 });
  }

  const commandes = await listerCommandes(sessionId);
  return NextResponse.json({ commandes });
}
