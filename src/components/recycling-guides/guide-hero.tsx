import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Search, ChevronRight } from "lucide-react";

export function GuideHero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'recycling-guide-hero');

  return (
    <section className="relative w-full pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32 bg-primary/10 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2"
        poster={heroImage?.imageUrl}
      >
        <source src="https://videos.pexels.com/video-files/7547378/7547378-hd_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-sm mb-4">
              <Link href="/" className="hover:underline">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/80">Recycling Guides</span>
          </div>
          <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Complete Recycling Guide
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90">
            Everything you need to know about waste management, disposal, and recycling.
          </p>
        </div>
      </div>
    </section>
  );
}
