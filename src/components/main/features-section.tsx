
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Camera,
  MapPin,
  ShoppingCart,
  Award,
  Trophy,
  Users,
} from "lucide-react";

const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Recycling Guides",
    description: "Comprehensive waste management information.",
    href: "/recycling-guides",
  },
  {
    icon: <Camera className="h-8 w-8 text-primary" />,
    title: "AI Waste Identifier",
    description: "Classify waste using AI technology.",
    href: "/ai-identifier",
  },
  {
    icon: <MapPin className="h-8 w-8 text-primary" />,
    title: "Recycling Centers",
    description: "Find nearest disposal facilities.",
    href: "/recycling-centers",
  },
  {
    icon: <ShoppingCart className="h-8 w-8 text-primary" />,
    title: "Marketplace",
    description: "Buy/sell second-hand items.",
    href: "/marketplace",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Key Features</div>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
            A Greener Lifestyle, Simplified
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our platform offers a suite of tools designed to make sustainable living accessible and rewarding for everyone.
          </p>
        </div>
        <div className="mx-auto grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.title} className="group">
              <Card className="h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <CardHeader className="flex flex-col items-center text-center">
                  {feature.icon}
                  <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
