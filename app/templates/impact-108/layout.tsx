import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Ledger & Associés — Cabinet d'expertise comptable Bordeaux",
  description:
    "Ledger & Associés, cabinet d'expertise comptable à Bordeaux. 25 ans d'expérience, 350 clients, 12 experts. Premier rendez-vous gratuit.",
};

export default function LedgerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
