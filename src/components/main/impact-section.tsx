import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    location: "California, USA",
    text: "EcoCity completely changed how my family handles waste. The guides are so easy to follow, and the rewards are a great motivator!",
    avatarId: "testimonial-1",
  },
  {
    name: "David L.",
    location: "London, UK",
    text: "The AI identifier is magic! I finally know what to do with all the different types of plastic. Highly recommended.",
    avatarId: "testimonial-2",
  },
];

const partners = [
  "GreenPeace",
  "WWF",
  "Ocean Conservancy",
  "EarthDay.org",
  "The Nature Conservancy",
];

export function ImpactSection() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'impact-map');
  
  return (
    <section id="impact" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Global Impact</div>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
            A Community Making a Difference
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            From local neighborhoods to a global movement, EcoCity users are driving real change.
          </p>
        </div>
        <div className="mt-12">
            {mapImage && (
                <Image
                    src={mapImage.imageUrl}
                    alt={mapImage.description}
                    width={1200}
                    height={600}
                    className="mx-auto rounded-lg shadow-lg"
                    data-ai-hint={mapImage.imageHint}
                />
            )}
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 pt-16 sm:grid-cols-1 md:grid-cols-2">
          {testimonials.map((testimonial) => {
            const avatarImage = PlaceHolderImages.find(p => p.id === testimonial.avatarId);
            return (
              <Card key={testimonial.name}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {avatarImage && (
                      <Avatar>
                        <AvatarImage src={avatarImage.imageUrl} alt={testimonial.name} data-ai-hint={avatarImage.imageHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                        </div>
                        <div className="flex items-center gap-0.5 text-accent">
                          {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                        </div>
                      </div>
                      <blockquote className="mt-4 text-sm text-foreground">
                        "{testimonial.text}"
                      </blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-16">
            <h3 className="text-center font-headline text-lg font-semibold text-muted-foreground">Our Partners & Supporters</h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
                {partners.map(partner => (
                    <span key={partner} className="text-2xl font-semibold text-muted-foreground/60 filter grayscale transition-all hover:grayscale-0 hover:text-foreground">
                        {partner}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
