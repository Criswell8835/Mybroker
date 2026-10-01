import { Faq } from "@/components/Faq";
import { FinalCTA } from "@/components/FinalCTA";
import {
  AiTradingBand,
  CopyTradingBand,
  MarketsBand,
  PlatformOffer,
  PlatformStats,
  ProductShowcase,
  TestimonialRail,
  WhyPlatform,
} from "@/components/home/HomeExperience";
import { Hero } from "@/components/Hero";
import { MarketTicker } from "@/components/MarketTicker";
import { Pricing } from "@/components/Pricing";
import { PublicShell } from "@/components/PublicShell";

export function HomePage() {
  return (
    <PublicShell>
      <Hero />
      <MarketTicker />
      <PlatformStats />
      <PlatformOffer />
      <WhyPlatform />
      <ProductShowcase />
      <AiTradingBand />
      <CopyTradingBand />
      <MarketsBand />
      <TestimonialRail />
      <Pricing />
      <Faq />
      <FinalCTA />
    </PublicShell>
  );
}
