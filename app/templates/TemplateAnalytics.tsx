"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// Google Analytics 4 for the DELIVERED client site (impact-* templates).
// The /site and /preview routes redirect to /templates/[id] before their own
// GA4 tag loads, so without this the client's site had NO analytics at all.
// Loaded here in the /templates layout, it covers every template.
//
// Beyond a pageview it wires the events that actually matter for a local
// business — phone taps, email clicks, contact-form submits, and CTA clicks
// (réserver / devis / rendez-vous) — so the client sees real conversions in
// GA4, not just visits.
const GA4_RE = /^G-[A-Z0-9]{4,20}$/;

// Per-visitor consent for the DELIVERED client site's analytics. GA4 drops
// measurement cookies, which under ePrivacy/CNIL require prior opt-in — the
// client's site (not Aevia's) is the data controller here, so the banner below
// is neutral and lives on the delivered site. Stored per browser; refusing is
// as easy as accepting (no pre-tick, symmetric buttons).
const SITE_CONSENT_KEY = "site-analytics-consent";
type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(SITE_CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function TemplateAnalytics() {
  const [ga4Id, setGa4Id] = useState<string | null>(null);
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const sid = new URLSearchParams(window.location.search).get("session");
    if (!sid) return;
    fetch(`/api/sessions?id=${sid}`)
      .then((r) => r.json())
      .then((s) => {
        const id = s?.formData?.ga4Id;
        if (id && GA4_RE.test(id)) setGa4Id(id);
      })
      .catch(() => {});
  }, []);

  // Load any prior choice on mount.
  useEffect(() => {
    setConsent(readConsent());
  }, []);

  const choose = (c: "granted" | "denied") => {
    try {
      localStorage.setItem(SITE_CONSENT_KEY, c);
    } catch {
      /* storage blocked — keep the choice in memory for this session */
    }
    setConsent(c);
  };

  const active = Boolean(ga4Id) && consent === "granted";

  // Conversion events via one delegated listener — works for content injected
  // after mount too. Registered only once GA4 is active.
  useEffect(() => {
    if (!active) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (...a: unknown[]) => (window as any).gtag?.(...a);

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        'a, button, [role="button"]',
      ) as HTMLElement | null;
      if (!el) return;
      const href = (el.getAttribute("href") || "").trim();
      const label = (el.textContent || "").trim().slice(0, 80);
      if (href.startsWith("tel:")) {
        gtag("event", "phone_click", { value: href.replace("tel:", "") });
      } else if (href.startsWith("mailto:")) {
        gtag("event", "email_click", { value: href.replace("mailto:", "") });
      } else if (/rendez|reserv|réserv|devis|book|contact|commander|appointment/i.test(label + " " + href)) {
        gtag("event", "cta_click", { cta_text: label });
      }
    };
    const onSubmit = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName === "FORM") {
        gtag("event", "form_submit");
        gtag("event", "generate_lead");
      }
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, [active]);

  // No GA4 configured for this site → nothing to consent to, nothing to load.
  if (!ga4Id) return null;

  // GA4 configured but the visitor hasn't chosen yet → show the consent banner
  // and load nothing. (ePrivacy: no measurement cookie before opt-in.)
  if (consent === null) {
    return (
      <div
        role="dialog"
        aria-label="Consentement aux cookies de mesure d'audience"
        style={{
          position: "fixed",
          insetInline: 0,
          bottom: 0,
          zIndex: 2147483000,
          background: "#111",
          color: "#fff",
          padding: "14px 16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          lineHeight: 1.4,
          boxShadow: "0 -2px 12px rgba(0,0,0,.25)",
        }}
      >
        <span style={{ maxWidth: "620px" }}>
          Ce site utilise des cookies de mesure d&apos;audience (Google Analytics)
          pour comprendre sa fréquentation. Ils ne sont déposés qu&apos;avec votre
          accord.
        </span>
        <span style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => choose("denied")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,.4)",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("granted")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#fff",
              color: "#111",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Accepter
          </button>
        </span>
      </div>
    );
  }

  // Consent denied → never load GA4.
  if (!active) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
      <Script id="ga4-template-init" strategy="afterInteractive">{`
        window.dataLayer=window.dataLayer||[];
        function gtag(){dataLayer.push(arguments);}
        gtag('js',new Date());
        gtag('config','${ga4Id}',{anonymize_ip:true});
      `}</Script>
    </>
  );
}
