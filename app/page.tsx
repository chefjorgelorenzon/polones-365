import HeroSection from "@/components/marketing/HeroSection";
import HowItWorks from "@/components/marketing/HowItWorks";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MethodStats from "@/components/marketing/MethodStats";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <MarketingHeader />
      <HeroSection />
      <MethodStats />
      <HowItWorks />
    </main>
  );
}