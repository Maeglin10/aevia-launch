import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pixel Republic — Agence web & digitale à Paris",
  description: "Agence digitale parisienne spécialisée en création de sites web, applications, SEO et identité visuelle. Devis gratuit.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
