import { WebchatBridge } from "./WebchatBridge";
import { BrandColorVar } from "./BrandColorVar";
import { SiteSchema } from "./SiteSchema";
import { SiteImages } from "./SiteImages";
import { TemplateAnalytics } from "./TemplateAnalytics";

export const dynamic = 'force-dynamic';

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BrandColorVar />
      <SiteSchema />
      <SiteImages />
      <TemplateAnalytics />
      {children}
      <WebchatBridge />
    </>
  );
}
