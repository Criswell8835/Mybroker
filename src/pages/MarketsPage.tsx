import { AccountCta } from "@/components/AccountCta";
import { CryptoMarkets } from "@/components/CryptoMarkets";
import { PublicShell } from "@/components/PublicShell";
import { Reveal } from "@/components/Reveal";

export function MarketsPage() {
  return (
    <PublicShell>
      <section className="px-5 pb-2 pt-32 sm:px-8 lg:px-12 lg:pt-40">
        <Reveal className="mx-auto max-w-[1200px]">
          <p className="text-[11px] tracking-[0.26em] text-zinc-500">MARKETS</p>
          <h1 className="mt-5 max-w-3xl text-[40px] font-normal leading-[1.02] tracking-[-0.045em] text-white sm:text-[60px]">
            A sample desk for the majors.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-zinc-400">
            BTC, ETH, SOL, BNB, and XRP are shown with demonstration prices.
            These figures are not a live market feed.
          </p>
        </Reveal>
      </section>
      <CryptoMarkets />
      <AccountCta
        title="Start from an account."
        text="Market research is visible here. Trading access begins at account creation."
        label="Start Trading"
      />
    </PublicShell>
  );
}
