import type { Metadata } from "next";
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
  };
}

export default async function PreviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const session = await getSessionFromBlob(sessionId);
  const localBusinessSchema = session ? buildLocalBusinessSchema(session) : null;

  return (
    <>
      {localBusinessSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      )}
      <PreviewClient sessionId={sessionId} />
    </>
  );
}
