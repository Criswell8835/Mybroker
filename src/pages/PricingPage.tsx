import { Pricing } from "@/components/Pricing";
import { PublicShell } from "@/components/PublicShell";

export function PricingPage() {
  return (
    <PublicShell>
      <div className="pt-16">
        <Pricing />
      </div>
    </PublicShell>
  );
}
