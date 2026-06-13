"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const GA_ID = "G-9XTKCZLYVF";
const CONSENT_KEY = "aevia-cookie-consent";

export function ConsentAwareAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    function check() {
      try {
        const raw = localStorage.getItem(CONSENT_KEY);
        if (raw) setAllowed(JSON.parse(raw).analytics === true);
      } catch {}
    }
    check();
    window.addEventListener("storage", check);
    window.addEventListener("aevia-consent-updated", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("aevia-consent-updated", check);
    };
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
        window.dataLayer=window.dataLayer||[];
        function gtag(){dataLayer.push(arguments);}
        gtag('js',new Date());
        gtag('config','${GA_ID}');
      `}</Script>
    </>
  );
}
