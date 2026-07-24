import { LegalDocPage } from "@/components/legal/LegalDocPage";

const SLUG_TO_DOC = {
  "mentions-legales": "mentionsLegales",
  "cgv": "cgv",
  "confidentialite": "confidentialite",
  "cgu": "cgu",
} as const;

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const doc = SLUG_TO_DOC[page as keyof typeof SLUG_TO_DOC] ?? "mentionsLegales";
  return <LegalDocPage doc={doc} basePath="/templates/impact-229" />;
}
