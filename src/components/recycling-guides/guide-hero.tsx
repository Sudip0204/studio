import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, ChevronRight } from "lucide-react";

export function GuideHero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'recycling-guide-hero');

  return (
    <section className="relative w-full pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 bg-primary/10">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span>Recycling Guides</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Complete Recycling Guide
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            Everything you need to know about waste management, disposal, and recycling.
          </p>
        </div>
      </div>
    </section>
  );
}
