import { Faq } from "@/components/Faq";
import { PublicShell } from "@/components/PublicShell";

export function FaqPage() {
  return (
    <PublicShell>
      <div className="pt-16">
        <Faq />
      </div>
    </PublicShell>
  );
}
