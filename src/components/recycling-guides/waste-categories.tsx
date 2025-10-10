"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { wasteCategories, type WasteCategory, type WasteDetail } from "@/app/recycling-guides/data";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

function DetailSection({ detail }: { detail: WasteDetail }) {
  const isLink = detail.title.toLowerCase().includes("resources");

  return (
    <div>
      <h4 className="font-headline font-semibold text-foreground mb-2">{detail.title}</h4>
      {Array.isArray(detail.content) ? (
        <ul className="space-y-2">
          {detail.content.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-muted-foreground">
              {isLink ? (
                <Link href="#" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <ExternalLink className="h-4 w-4 flex-shrink-0 mt-1" />
                  <span>{item}</span>
                </Link>
              ) : (
                <>
                  <span className="text-primary font-bold mt-1">&#8227;</span>
                  <p dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">{detail.content}</p>
      )}
    </div>
  );
}


export function WasteCategories() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Waste Categories</div>
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
            A Guide to Different Waste Types
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Understanding how to sort your waste is the first step to effective recycling. Explore the categories below.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
          {wasteCategories.map((category) => {
            const image = PlaceHolderImages.find(p => p.id === category.imageId);
            return (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-lg font-headline hover:no-underline px-6 py-4 rounded-lg hover:bg-background/80 transition-colors data-[state=open]:bg-background data-[state=open]:shadow-md">
                <div className="flex items-center gap-4">
                  <category.Icon className={cn("h-7 w-7", category.color)} />
                  <span>{category.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-6 bg-background rounded-b-lg shadow-inner-lg">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <p className="text-muted-foreground">{category.description}</p>
                        {category.details.map((detail, index) => (
                          <DetailSection key={index} detail={detail} />
                        ))}
                    </div>
                    <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
                        {image && (
                            <Image 
                                src={image.imageUrl} 
                                alt={category.title} 
                                fill 
                                className="object-cover"
                                data-ai-hint={image.imageHint}
                            />
                        )}
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )})}
        </Accordion>
      </div>
    </section>
  );
}
