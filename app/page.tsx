import { AITradingSection } from "@/components/AITradingSection";
import { CopyTradingSection } from "@/components/CopyTradingSection";
import { CopyTradingSteps } from "@/components/CopyTradingSteps";
import { CryptoMarkets } from "@/components/CryptoMarkets";
import { DashboardPreview } from "@/components/DashboardPreview";
import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { FinalCTA } from "@/components/FinalCTA";
import { FloatingActivityNotification } from "@/components/FloatingActivityNotification";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MarketTicker } from "@/components/MarketTicker";
import { Navbar } from "@/components/Navbar";
import { Pricing } from "@/components/Pricing";
import { SecuritySection } from "@/components/SecuritySection";
import { TradingStrategies } from "@/components/TradingStrategies";

export default function Home() {
  return (
    <>
      <Navbar />
      <FloatingActivityNotification />
      <main className="overflow-x-hidden">
        <Hero />
        <MarketTicker />
        <AITradingSection />
        <TradingStrategies />
        <CopyTradingSection />
        <CopyTradingSteps />
        <CryptoMarkets />
        <DashboardPreview />
        <Features />
        <SecuritySection />
        <Pricing />
        <Faq />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
