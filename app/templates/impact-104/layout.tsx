import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Studio Lumière Dorée — Photographe Mariage Paris",
  description:
    "Studio Lumière Dorée, photographe mariage & portraits à Paris. 12 ans d'expérience, 400+ mariages, 4.9★. Demandez votre devis gratuit.",
};

export default function LumiereDoreLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
