"use client";

import dynamic from "next/dynamic";
import type { SessionData } from "@/lib/sessions";

// Standard Themes
const EcommerceTheme = dynamic(() => import("./themes/EcommerceTheme").then(m => ({ default: m.EcommerceTheme })));
const LandingTheme = dynamic(() => import("./themes/LandingTheme").then(m => ({ default: m.LandingTheme })));
const AgencyTheme = dynamic(() => import("./themes/AgencyTheme").then(m => ({ default: m.AgencyTheme })));
const VitrineTheme = dynamic(() => import("./themes/VitrineTheme").then(m => ({ default: m.VitrineTheme })));
const RestaurantTheme = dynamic(() => import("./themes/RestaurantTheme").then(m => ({ default: m.RestaurantTheme })));
const SaasTheme = dynamic(() => import("./themes/SaasTheme").then(m => ({ default: m.SaasTheme })));

// Specialized Themes
const HotelTheme = dynamic(() => import("./themes/HotelTheme").then(m => ({ default: m.HotelTheme })));
const HealthcareTheme = dynamic(() => import("./themes/HealthcareTheme").then(m => ({ default: m.HealthcareTheme })));
const RealEstateTheme = dynamic(() => import("./themes/RealEstateTheme").then(m => ({ default: m.RealEstateTheme })));
const FitnessTheme = dynamic(() => import("./themes/FitnessTheme").then(m => ({ default: m.FitnessTheme })));
const ConsultantTheme = dynamic(() => import("./themes/ConsultantTheme").then(m => ({ default: m.ConsultantTheme })));
const PortfolioTheme = dynamic(() => import("./themes/PortfolioTheme").then(m => ({ default: m.PortfolioTheme })));
const EventTheme = dynamic(() => import("./themes/EventTheme").then(m => ({ default: m.EventTheme })));
const NonprofitTheme = dynamic(() => import("./themes/NonprofitTheme").then(m => ({ default: m.NonprofitTheme })));
const MagazineTheme = dynamic(() => import("./themes/MagazineTheme").then(m => ({ default: m.MagazineTheme })));
const StartupTheme = dynamic(() => import("./themes/StartupTheme").then(m => ({ default: m.StartupTheme })));
const TechTheme = dynamic(() => import("./themes/TechTheme").then(m => ({ default: m.TechTheme })));

// Variations & Premium
const EcommerceLuxuryTheme = dynamic(() => import("./themes/EcommerceLuxuryTheme").then(m => ({ default: m.EcommerceLuxuryTheme })));
const EcommerceMinimalTheme = dynamic(() => import("./themes/EcommerceMinimalTheme").then(m => ({ default: m.EcommerceMinimalTheme })));
const LandingPersonalTheme = dynamic(() => import("./themes/LandingPersonalTheme").then(m => ({ default: m.LandingPersonalTheme })));
const AgencyMinimalTheme = dynamic(() => import("./themes/AgencyMinimalTheme").then(m => ({ default: m.AgencyMinimalTheme })));
const VitrineModernTheme = dynamic(() => import("./themes/VitrineModernTheme").then(m => ({ default: m.VitrineModernTheme })));
const BistroTheme = dynamic(() => import("./themes/BistroTheme").then(m => ({ default: m.BistroTheme })));
const LuxuryTheme = dynamic(() => import("./themes/LuxuryTheme").then(m => ({ default: m.LuxuryTheme })));
const AuroraTheme = dynamic(() => import("./themes/AuroraTheme").then(m => ({ default: m.AuroraTheme })));
const BrutalistTheme = dynamic(() => import("./themes/BrutalistTheme").then(m => ({ default: m.BrutalistTheme })));
const MinimalProTheme = dynamic(() => import("./themes/MinimalProTheme").then(m => ({ default: m.MinimalProTheme })));

export default function GeneratedSite({ session }: { session: SessionData }) {
  const template = session.formData.template?.toLowerCase() || "landing";
  const businessType = session.formData.businessType?.toLowerCase() || "";

  // Dynamic Router Logic
  // This allows us to provide "Choice" by mapping business types or styles to specific theme variations
  const renderTheme = () => {
    switch (template) {
      case "ecommerce":
        if (businessType.includes("luxury") || businessType.includes("premium")) return <EcommerceLuxuryTheme session={session} />;
        if (businessType.includes("minimal") || businessType.includes("swiss")) return <EcommerceMinimalTheme session={session} />;
        return <EcommerceTheme session={session} />;
      
      case "landing":
        if (businessType.includes("personal") || businessType.includes("me")) return <LandingPersonalTheme session={session} />;
        return <LandingTheme session={session} />;
      
      case "agency":
        if (businessType.includes("minimal")) return <AgencyMinimalTheme session={session} />;
        return <AgencyTheme session={session} />;
      
      case "vitrine":
        if (businessType.includes("modern") || businessType.includes("tech")) return <VitrineModernTheme session={session} />;
        return <VitrineTheme session={session} />;
      
      case "restaurant":
        if (businessType.includes("bistro") || businessType.includes("cafe")) return <BistroTheme session={session} />;
        return <RestaurantTheme session={session} />;
      
      case "saas": return <SaasTheme session={session} />;
      case "startup": return <StartupTheme session={session} />;
      case "hotel": return <HotelTheme session={session} />;
      case "healthcare": return <HealthcareTheme session={session} />;
      case "realestate": return <RealEstateTheme session={session} />;
      case "fitness": return <FitnessTheme session={session} />;
      case "consultant": return <ConsultantTheme session={session} />;
      case "portfolio": return <PortfolioTheme session={session} />;
      case "event": return <EventTheme session={session} />;
      case "nonprofit": return <NonprofitTheme session={session} />;
      case "magazine": return <MagazineTheme session={session} />;
      case "3d-tech": return <TechTheme session={session} />;
      case "luxury": return <LuxuryTheme session={session} />;
      case "aurora": return <AuroraTheme session={session} />;
      case "brutalist": return <BrutalistTheme session={session} />;
      case "minimal-pro": return <MinimalProTheme session={session} />;
      
      default:
        return <LandingTheme session={session} />;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {renderTheme()}
    </div>
  );
}
