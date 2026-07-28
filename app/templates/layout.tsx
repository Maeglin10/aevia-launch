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
      {/* The root layout renders a "Skip to main content" link targeting
          #main-content. That id exists on Aevia's own pages but on none of the
          315 templates, so the skip link — the first stop for a keyboard or
          screen-reader user — went nowhere on every client site. */}
      <div id="main-content">{children}</div>
      <WebchatBridge />
    </>
  );
}
