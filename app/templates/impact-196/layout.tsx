import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kiné Mouvement — Cabinet de kinésithérapie à Nantes",
  description: "Cabinet de kinésithérapie spécialisé en rééducation orthopédique, neurologique, sportive et respiratoire à Nantes.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
