import TemplateLegal from "@/app/templates/_shared/TemplateLegal";

import { clientName } from "@/lib/templates/clientContent";
export default function Page() {
  return <TemplateLegal only="mentionsLegales" />;
}
