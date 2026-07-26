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

export function TemplateAnalytics() {
  const [ga4Id, setGa4Id] = useState<string | null>(null);

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

  // Conversion events via one delegated listener — works for content injected
  // after mount too. Registered only once GA4 is active.
  useEffect(() => {
    if (!ga4Id) return;
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
  }, [ga4Id]);

  if (!ga4Id) return null;
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
