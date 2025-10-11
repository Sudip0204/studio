
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShoppingCart, PlusCircle, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/firebase";

// Placeholder data for products
const products = [
  { id: 1, name: "Upcycled Denim Jacket", price: 3600, description: "A stylish jacket made from reclaimed denim.", image: "https://picsum.photos/seed/product1/300/300", seller: "GreenThreads", dataAiHint: "denim jacket" },
  { id: 2, name: "Recycled Glass Vases", price: 2000, description: "Beautiful vases crafted from recycled glass.", image: "https://picsum.photos/seed/product2/300/300", seller: "EcoDecor", dataAiHint: "glass vase" },
  { id: 3, name: "Handmade Wooden Bowl", price: 2400, description: "A unique bowl carved from sustainable wood.", image: "https://picsum.photos/seed/product3/300/300", seller: "ArtisanWood", dataAiHint: "wooden bowl" },
  { id: 4, name: "Vintage Leather Bag", price: 4800, description: "A classic leather bag with a timeless design.", image: "https://picsum.photos/seed/product4/300/300", seller: "RetroFinds", dataAiHint: "leather bag" },
  { id: 5, name: "Bamboo Toothbrush Set", price: 960, description: "An eco-friendly alternative to plastic toothbrushes.", image: "https://picsum.photos/seed/product5/300/300", seller: "EcoEssentials", dataAiHint: "bamboo toothbrush" },
  { id: 6, name: "Second-hand Novel Set", price: 1440, description: "A collection of pre-loved novels for your reading pleasure.", image: "https://picsum.photos/seed/product6/300/300", seller: "BookCycle", dataAiHint: "books pile" },
];

export default function MarketplacePage() {
  const { user } = useUser();

  return (
    <div className="bg-background">
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <ShoppingCart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                EcoCity Marketplace
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
                Buy and sell second-hand, recycled, and upcycled products. Join our community in promoting a circular economy.
            </p>
             <div className="mt-8 flex gap-4 justify-center">
                <Button asChild size="lg">
                    <Link href={user ? "/marketplace/sell" : "/login"}>
                        <PlusCircle className="mr-2" /> Sell Your Item
                    </Link>
                </Button>
            </div>
        </div>
      </section>
      
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold font-headline mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-square">
                  <Image src={product.image} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={product.dataAiHint}/>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 h-[40px]">{product.description}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2"><User className="h-3 w-3"/>{product.seller}</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="font-bold text-lg text-primary">₹{product.price}</p>
                  <Button variant="outline" size="sm" onClick={() => alert('This will be added to cart!')}>Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
