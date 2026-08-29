import { NextRequest, NextResponse } from "next/server";
import {
  decodeState,
  exchangeGoogleCode,
  autoProvisionGa4,
  fetchGscVerificationToken,
} from "@/lib/google-oauth";
import { getSessionFromBlob, saveSessionToBlob, saveSession } from "@/lib/sessions";
import { avisDuClient, avisGoogleActif } from "@/lib/google-avis";
import type { SessionData, FormData, BusinessProfile } from "@/lib/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public callback — Google redirects here after the user grants (or denies)
// consent. Never logs the access/refresh token; both are used once in this
// request and discarded (no long-lived Google credential storage yet).
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;

  if (error || !code || !state) {
    return NextResponse.redirect(`${base}/configure?google=error&reason=denied`);
  }

  let sessionId: string;
  try {
    sessionId = decodeState(state);
  } catch {
    return NextResponse.redirect(`${base}/configure?google=error&reason=invalid_state`);
  }

  const session = await getSessionFromBlob(sessionId);
  if (!session) {
    return NextResponse.redirect(`${base}/configure?google=error&reason=session_not_found`);
  }

  const previewUrl = `${base}/preview/${sessionId}`;

  try {
    const tokens = await exchangeGoogleCode(code);
    const businessName = session.formData.businessName || "Site web";

    const results: { ga4?: string | null; gsc?: string; errors: string[] } = { errors: [] };

    try {
      results.ga4 = await autoProvisionGa4(tokens.access_token, businessName, previewUrl);
    } catch (err) {
      results.errors.push(`ga4:${err instanceof Error ? err.message : "unknown"}`);
    }

    try {
      results.gsc = await fetchGscVerificationToken(tokens.access_token, previewUrl);
    } catch (err) {
      results.errors.push(`gsc:${err instanceof Error ? err.message : "unknown"}`);
    }

    /*
      Les avis, quand l'accès Business Profile est ouvert.

      Ce sont les données du client, récupérées avec son consentement : on peut
      les conserver, contrairement au contenu de l'API Places. Ses avis déjà
      saisis passent devant — on n'écrase jamais ce qu'il a écrit lui-même.
    */
    let profilUpdate: BusinessProfile | undefined;
    if (avisGoogleActif()) {
      try {
        const lus = await avisDuClient(tokens.access_token);
        const deja = session.businessProfile?.reputation?.featuredReviews ?? [];
        const connus = new Set(deja.map((r) => (r.text ?? "").slice(0, 40).toLowerCase()));
        const neufs = lus.filter((a) => !connus.has(a.text.slice(0, 40).toLowerCase()));
        if (neufs.length) {
          profilUpdate = {
            ...(session.businessProfile ?? {}),
            reputation: {
              ...(session.businessProfile?.reputation ?? {}),
              featuredReviews: [...deja, ...neufs],
            },
          };
        }
      } catch (err) {
        /* 403 tant que Google n'a pas approuvé la demande : ce n'est pas une
           panne, et cela ne doit pas faire échouer Analytics ni Search Console. */
        results.errors.push(`avis:${err instanceof Error ? err.message : "unknown"}`);
      }
    }

    const formDataUpdate: Partial<FormData> = {
      ...(results.ga4 ? { ga4Id: results.ga4 } : {}),
      ...(results.gsc ? { gscVerification: results.gsc } : {}),
    };

    if (Object.keys(formDataUpdate).length > 0 || profilUpdate) {
      const updated: SessionData = {
        ...session,
        formData: { ...session.formData, ...formDataUpdate },
        ...(profilUpdate ? { businessProfile: profilUpdate } : {}),
      };
      try {
        await saveSessionToBlob(sessionId, updated);
      } catch {
        saveSession(sessionId, updated);
      }
    }

    const status =
      results.ga4 && results.gsc ? "connected" : results.ga4 || results.gsc ? "partial" : "failed";
    const noGa4Account = results.errors.length === 0 && !results.ga4;
    const params = new URLSearchParams({ google: status });
    if (noGa4Account) params.set("ga4_reason", "no_account");

    return NextResponse.redirect(`${previewUrl}?${params.toString()}`);
  } catch (err) {
    console.error("[google/callback] OAuth flow failed:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(`${previewUrl}?google=error`);
  }
}
