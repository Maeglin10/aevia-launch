import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-oauth";
import { getSessionFromBlob } from "@/lib/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Redirects to Google's consent screen. Requires an existing session (the
// wizard must have finished generation) so the callback has somewhere to
// write the resulting GA4 ID / Search Console token back to.
export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session" }, { status: 400 });
  }

  const session = await getSessionFromBlob(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  try {
    return NextResponse.redirect(getGoogleAuthUrl(sessionId));
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Google OAuth not configured" },
      { status: 500 },
    );
  }
}
