import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const benefits = [
  "Learn to recycle correctly",
  "Find local disposal centers",
  "Earn rewards for green actions",
  "Join an eco-conscious community",
];

export function AboutSection() {
  const aboutImage = PlaceHolderImages.find(p => p.id === 'about-mission');

  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Mission</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simplifying Sustainability
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              At EcoCity, our mission is to empower individuals with the knowledge and tools to make a positive environmental impact. We believe that small, collective actions can lead to significant global change.
            </p>
            <Card className="bg-card">
              <CardContent className="p-6">
                <h3 className="font-headline font-semibold text-lg mb-4">Key Benefits of Joining EcoCity</h3>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center justify-center">
            {aboutImage && (
               <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                width={800}
                height={600}
                className="rounded-xl object-cover shadow-2xl"
                data-ai-hint={aboutImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
