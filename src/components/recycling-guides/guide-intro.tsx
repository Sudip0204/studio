import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Redo, Reduce } from "lucide-react";

const threeRs = [
  {
    icon: <Reduce className="h-10 w-10 text-primary" />,
    title: "Reduce",
    description: "Minimize the amount of waste we create in the first place. Choose products with less packaging and say no to single-use items."
  },
  {
    icon: <Redo className="h-10 w-10 text-primary" />,
    title: "Reuse",
    description: "Find new ways to use items that would otherwise be thrown away. Repurpose jars, donate old clothes, and repair broken items."
  },
  {
    icon: <Recycle className="h-10 w-10 text-primary" />,
    title: "Recycle",
    description: "Convert waste materials into new products to prevent the consumption of fresh raw materials and reduce energy usage."
  }
]

export function GuideIntro() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-headline text-3xl font-bold tracking-tighter text-primary sm:text-4xl">
              Why Recycling Matters
            </h2>
            <p className="text-muted-foreground">
              Improper waste disposal poses a significant threat to our environment, from polluting our oceans to filling up landfills. Recycling is a crucial part of the solution.
            </p>
            <p className="text-muted-foreground">
              By turning waste into new products, we conserve natural resources, save energy, reduce pollution, and create economic benefits. Every individual's action contributes to a massive collective impact, building a cleaner, more sustainable world for future generations.
            </p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {threeRs.map(item => (
              <Card key={item.title} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="font-headline text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
