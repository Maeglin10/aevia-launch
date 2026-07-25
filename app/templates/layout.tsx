import { WebchatBridge } from "./WebchatBridge";
import { BrandColorVar } from "./BrandColorVar";

export const dynamic = 'force-dynamic';

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BrandColorVar />
      {children}
      <WebchatBridge />
    </>
  );
}
