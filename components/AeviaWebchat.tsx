"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export function AeviaWebchat() {
  const pathname = usePathname();

  // Disable webchat widget on template previews, session preview pages, and client showcase pages
  if (
    pathname?.startsWith("/templates/") ||
    pathname?.startsWith("/preview/") ||
    pathname?.startsWith("/maison-maria/")
  ) {
    return null;
  }

  return (
    <Script
      async
      src="https://inbox.aevia.services/webchat/widget.js"
      data-widget-id="wid_2a6ea934ea6a6404d285e9fc93cb0707"
      data-api-url="https://skybot-inbox-production.up.railway.app/api/v1"
      strategy="afterInteractive"
    />
  );
}
