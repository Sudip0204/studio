import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake } from "lucide-react";

export default function PartnersPage() {
  const partners = [
    "GreenPeace",
    "WWF",
    "Ocean Conservancy",
    "EarthDay.org",
    "The Nature Conservancy",
  ];
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Handshake className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Our Partners</CardTitle>
          <CardDescription>Working together for a greener planet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            We are proud to collaborate with leading environmental organizations and sustainability-focused companies to amplify our impact.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {partners.map(partner => (
              <span key={partner} className="text-2xl font-semibold text-muted-foreground/80">
                {partner}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
