import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export const runtime = "nodejs";

/*
  Le lien « Ne plus recevoir de rappel » des emails de relance. Un marqueur
  par session suffit : le cron le lit avant tout envoi. Pas de jeton exigé —
  la désinscription doit être en un clic (L.34-5 CPCE), et le pire abus
  possible est d'empêcher un rappel commercial.
*/
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session") ?? "";
  if (!/^[a-z0-9-]{8,64}$/i.test(sessionId)) {
    return NextResponse.json({ error: "Session invalide" }, { status: 400 });
  }
  try {
    await put(`unsubscribed/${sessionId}`, "1", {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "text/plain",
    });
  } catch {
    return NextResponse.json({ error: "Réessayez dans un instant" }, { status: 503 });
  }
  return new NextResponse(
    `<!DOCTYPE html><html lang="fr"><body style="font-family:system-ui;background:#09090b;color:#f4f4f5;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0"><div style="text-align:center;max-width:420px;padding:24px"><p style="font-size:40px;margin:0 0 12px">✓</p><h1 style="font-size:20px;margin:0 0 8px">C'est noté</h1><p style="color:#a1a1aa;font-size:14px;line-height:1.6">Vous ne recevrez plus de rappel concernant cet aperçu. Il reste accessible depuis votre lien habituel.</p></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}
