import { WebchatBridge } from "./WebchatBridge";
import { BrandColorVar } from "./BrandColorVar";
import { SiteSchema } from "./SiteSchema";

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
      {children}
      <WebchatBridge />
    </>
  );
}
