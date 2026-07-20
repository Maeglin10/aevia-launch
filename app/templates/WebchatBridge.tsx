"use client";

import { useEffect } from "react";

const INBOX_ORIGIN =
  process.env.NEXT_PUBLIC_AEVIA_INBOX_URL || "https://inbox.aevia.services";

/**
 * If this site's owner already has an active Inbox webchat widget, embed it
 * automatically — no manual snippet copy-paste. Runs once per page load:
 * reads ?session=, resolves it to an accountId (set at Stripe checkout, see
 * app/api/webhook), looks up an active widget for that account, and injects
 * the same <script> tag a customer would otherwise paste by hand.
 */
export function WebchatBridge() {
  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session");
    if (!sessionId) return;
    if (document.querySelector("script[data-aevia-webchat]")) return; // already injected

    let cancelled = false;

    (async () => {
      try {
        const sessionRes = await fetch(`/api/sessions?id=${encodeURIComponent(sessionId)}`);
        if (!sessionRes.ok) return;
        const session = (await sessionRes.json()) as { accountId?: string };
        if (!session.accountId || cancelled) return;

        const widgetRes = await fetch(
          `/api/idp/aevia-bridge/webchat-widget/${encodeURIComponent(session.accountId)}`,
        );
        if (!widgetRes.ok || cancelled) return; // 404 = no active widget, nothing to embed
        const { widgetId } = (await widgetRes.json()) as { widgetId: string };
        if (!widgetId || cancelled) return;

        const script = document.createElement("script");
        script.src = `${INBOX_ORIGIN}/webchat/widget.js`;
        script.setAttribute("data-widget-id", widgetId);
        script.setAttribute("data-aevia-webchat", "true");
        script.async = true;
        document.body.appendChild(script);
      } catch {
        // Best-effort — a failed lookup must never break the site itself.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
