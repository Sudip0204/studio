import { AboutSection } from "@/components/main/about-section";
import { CtaSection } from "@/components/main/cta-section";
import { FeaturesSection } from "@/components/main/features-section";
import { HeroSection } from "@/components/main/hero-section";
import { ImpactSection } from "@/components/main/impact-section";
import { StatisticsSection } from "@/components/main/statistics-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <StatisticsSection />
        <ImpactSection />
        <CtaSection />
      </main>
    </div>
  );
}
