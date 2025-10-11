
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const symbols = [
  {
    id: "symbol-pet",
    title: "(1) PET / PETE",
    description: "Polyethylene Terephthalate. Found in soda bottles, water bottles, and salad dressing containers. Widely recycled.",
    imageHint: "recycling symbol 1"
  },
  {
    id: "symbol-hdpe",
    title: "(2) HDPE",
    description: "High-Density Polyethylene. Found in milk jugs, shampoo bottles, and cleaning agent bottles. Widely recycled.",
    imageHint: "recycling symbol 2"
  },
  {
    id: "symbol-pvc",
    title: "(3) PVC",
    description: "Polyvinyl Chloride. Found in pipes, window frames, and some packaging. Rarely recycled.",
    imageHint: "recycling symbol 3"
  },
  {
    id: "symbol-ldpe",
    title: "(4) LDPE",
    description: "Low-Density Polyethylene. Found in plastic bags, six-pack rings, and various containers. Not always accepted in curbside bins.",
    imageHint: "recycling symbol 4"
  },
  {
    id: "symbol-pp",
    title: "(5) PP",
    description: "Polypropylene. Found in yogurt containers, medicine bottles, and bottle caps. Increasingly recyclable.",
    imageHint: "recycling symbol 5"
  },
  {
    id: "symbol-ps",
    title: "(6) PS",
    description: "Polystyrene (Styrofoam). Found in disposable cups, take-out containers, and egg cartons. Difficult to recycle.",
    imageHint: "recycling symbol 6"
  },
  {
    id: "symbol-other",
    title: "(7) Other",
    description: "Includes various plastics like acrylic and nylon. Usually not recycled.",
    imageHint: "recycling symbol 7"
  }
];

export function RecyclingSymbolGuide() {
    return (
        <div className="p-4 max-h-[70vh] overflow-y-auto">
            <p className="text-muted-foreground mb-6 text-center">The number inside the triangle identifies the type of plastic. This symbol does not guarantee that it's recyclable in your area. Always check with your local recycling facility.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {symbols.map(symbol => {
                     const image = PlaceHolderImages.find(p => p.id === symbol.id);
                     return (
                        <Card key={symbol.id}>
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                {image && (
                                    <div className="relative h-16 w-16">
                                        <Image src={image.imageUrl} alt={symbol.title} fill className="object-contain" data-ai-hint={symbol.imageHint} />
                                    </div>
                                )}
                                <CardTitle>{symbol.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{symbol.description}</CardDescription>
                            </CardContent>
                        </Card>
                     )
                })}
            </div>
        </div>
    )
}
