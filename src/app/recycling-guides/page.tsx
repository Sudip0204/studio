import { GuideHero } from "@/components/recycling-guides/guide-hero";
import { GuideIntro } from "@/components/recycling-guides/guide-intro";
import { WasteCategories } from "@/components/recycling-guides/waste-categories";
import { InteractiveTools } from "@/components/recycling-guides/interactive-tools";
import { FaqSection } from "@/components/recycling-guides/faq-section";

export default function RecyclingGuidesPage() {
  return (
    <div className="bg-background">
      <GuideHero />
      <GuideIntro />
      <WasteCategories />
      <InteractiveTools />
      <FaqSection />
    </div>
  );
}
