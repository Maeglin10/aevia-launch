import type { Metadata } from "next";
import OrderClient from "./OrderClient";
import {
  DEFAULT_CURRENCY, isCurrency, type Currency,
} from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Récapitulatif de commande",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{
    type?: string;
    name?: string;
    theme?: string;
    maintenance?: string;
    branding?: string;
    currency?: string;
    color?: string;
    session?: string;
  }>;
}

export default async function OrderPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const siteType  = params.type  ?? "landing";
  const name      = params.name  ?? "Votre site";
  const theme     = params.theme ?? siteType;
  const maintenance = params.maintenance === "1";
  const branding    = params.branding === "1";
  const currency: Currency = isCurrency(params.currency) ? params.currency : DEFAULT_CURRENCY;
  const sessionId = params.session;

  return (
    <OrderClient
      siteType={siteType}
      name={name}
      theme={theme}
      maintenance={maintenance}
      branding={branding}
      currency={currency}
      sessionId={sessionId}
    />
  );
}
