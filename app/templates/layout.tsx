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
      {/* Tap targets. The catalogue sweep measured nav and footer links at
          15-21px tall on 259 templates — well under the 44px that makes a
          link comfortably hittable with a thumb. Growing the hit area here,
          once, rather than editing 315 files: the text does not move, only
          the box around it grows, and it is scoped to narrow viewports so
          desktop layouts are untouched. */}
      <style>{`
        @media (max-width: 900px) {
          /* Grow the hit area with padding only. Forcing display:inline-flex
             collapsed column-stacked footer lists onto one line. */
          nav a, nav button, footer a, footer button {
            padding-block: max(0px, calc((44px - 1em * 1.4) / 2));
          }
        }
      `}</style>
      {/* The root layout renders a "Skip to main content" link targeting
          #main-content. That id exists on Aevia's own pages but on none of the
          315 templates, so the skip link — the first stop for a keyboard or
          screen-reader user — went nowhere on every client site. */}
      <div id="main-content">{children}</div>
      <WebchatBridge />
    </>
  );
}
