import type { Metadata } from "next";
import Script from "next/script";
import { getSessionFromBlob } from "@/lib/sessions";
import { buildLocalBusinessSchema } from "@/lib/seo";
import PreviewClient from "./PreviewClient";

export async function generateMetadata({ params }: { params: Promise<{ sessionId: string }> }): Promise<Metadata> {
  const { sessionId } = await params;
  const s = await getSessionFromBlob(sessionId);
  if (!s?.generatedContent) return { title: "Preview — Aevia Launch", robots: { index: false } };
  return {
    title: s.generatedContent.metaTitle ?? "Preview",
    description: s.generatedContent.metaDescription ?? "Aperçu de votre site Aevia",
    robots: { index: false, follow: false },
    openGraph: {
      title: s.generatedContent.metaTitle,
      description: s.generatedContent.metaDescription,
    },
    ...(s.formData?.gscVerification && {
      verification: { google: s.formData.gscVerification },
    }),
  };
}

export default async function PreviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await getSessionFromBlob(sessionId);
  const localBusinessSchema = session ? buildLocalBusinessSchema(session) : null;

  // The schema is built from client-supplied form data and JSON.stringify does
  // NOT escape "</script>" — a crafted businessName could break out of the
  // JSON-LD block (XSS). Escaping "<" keeps the JSON valid and inert.
  const schemaJson = localBusinessSchema
    ? JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c")
    : null;

  // Client-supplied — only ever use it if it looks like a real GA4 measurement
  // id, otherwise it gets interpolated into an inline <script> (XSS).
  const rawGa4 = session?.formData?.ga4Id;
  const ga4Id = rawGa4 && /^G-[A-Z0-9]{4,20}$/.test(rawGa4) ? rawGa4 : null;

  return (
    <>
      {schemaJson && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaJson }}
        />
      )}
      {ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id={`ga4-preview-${sessionId}`} strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            gtag('config','${ga4Id}');
          `}</Script>
        </>
      )}
      <PreviewClient sessionId={sessionId} />
    </>
  );
}
