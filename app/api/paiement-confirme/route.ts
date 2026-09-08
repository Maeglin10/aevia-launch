import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";

export const runtime = "nodejs";

/*
  « Cette commande est-elle payée ? » — un booléen, rien d'autre. La page de
  succès ne doit plus affirmer « Paiement reçu » à quiconque tape l'URL : le
  webhook Stripe écrit paid/<session>.json, on ne fait que constater.
*/
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session") ?? "";
  if (!/^[a-z0-9-]{8,64}$/i.test(sessionId)) {
    return NextResponse.json({ paye: false });
  }
  try {
    const { blobs } = await list({ prefix: `paid/${sessionId}.json`, limit: 1 });
    return NextResponse.json({ paye: blobs.length > 0 });
  } catch {
    return NextResponse.json({ paye: false });
  }
}
