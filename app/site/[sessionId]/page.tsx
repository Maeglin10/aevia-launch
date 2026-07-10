import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Script from "next/script";
import { getSessionFromBlob } from "@/lib/sessions";
import { buildLocalBusinessSchema } from "@/lib/seo";
import GeneratedSite from "@/components/GeneratedSite";

// Stable, branded delivery URL for a purchased site — no preview chrome
// (edit bar, "Je veux ce site" CTA, cookie-demo banner), no /templates/{id}
// implementation detail leaking into the address bar. Same SEO/GA4/schema
// wiring as the preview page, reused here rather than duplicated.
//
// This is the site "live on Vercel" today — the skylaunch app already serves
// it dynamically from this Vercel deployment. What's still missing for a
// fully branded delivery is a custom domain (blocked on the Namecheap
// reseller account, not on this route) — until then, this /site/{id} URL
// under launch.aevia.services IS the real, working, final URL to hand to a
// client.

export async function generateMetadata({ params }: { params: Promise<{ sessionId: string }> }): Promise<Metadata> {
  const { sessionId } = await params;
  const s = await getSessionFromBlob(sessionId);
  if (!s?.generatedContent) return { title: "Aevia Launch", robots: { index: false } };
  return {
    title: s.generatedContent.metaTitle ?? s.formData.businessName,
    description: s.generatedContent.metaDescription,
    openGraph: {
      title: s.generatedContent.metaTitle,
      description: s.generatedContent.metaDescription,
    },
    ...(s.formData?.gscVerification && {
      verification: { google: s.formData.gscVerification },
    }),
  };
}

export default async function DeliveredSitePage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await getSessionFromBlob(sessionId);
  if (!session || !session.generatedContent) notFound();

  // impact-* templates render as full standalone pages (their own <html>,
  // fonts, nav) — serve them directly at this URL via redirect rather than
  // nesting, so this becomes their canonical address instead of just an
  // iframe source.
  if (session.formData.template?.startsWith("impact-")) {
    redirect(`/templates/${session.formData.template}?session=${sessionId}`);
  }

  const localBusinessSchema = buildLocalBusinessSchema(session);
  const schemaJson = JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c");

  const rawGa4 = session.formData.ga4Id;
  const ga4Id = rawGa4 && /^G-[A-Z0-9]{4,20}$/.test(rawGa4) ? rawGa4 : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
      {ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id={`ga4-site-${sessionId}`} strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            gtag('config','${ga4Id}');
          `}</Script>
        </>
      )}
      <GeneratedSite session={session} />
    </>
  );
}
