
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShoppingCart, PlusCircle, User, ListFilter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/firebase";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Expanded placeholder data for products
const initialProducts = [
  { id: 1, name: "Upcycled Denim Jacket", price: 3600, description: "A stylish jacket made from reclaimed denim.", image: "https://picsum.photos/seed/product1/300/300", seller: "GreenThreads", dataAiHint: "denim jacket", category: "Clothing", condition: "Good", location: "Mumbai Central" },
  { id: 2, name: "Recycled Glass Vases", price: 2000, description: "Beautiful vases crafted from recycled glass.", image: "https://picsum.photos/seed/product2/300/300", seller: "EcoDecor", dataAiHint: "glass vase", category: "Home Decor", condition: "New", location: "Andheri East" },
  { id: 3, name: "Handmade Wooden Bowl", price: 2400, description: "A unique bowl carved from sustainable wood.", image: "https://picsum.photos/seed/product3/300/300", seller: "ArtisanWood", dataAiHint: "wooden bowl", category: "Kitchenware", condition: "New", location: "Bandra West" },
  { id: 4, name: "Vintage Leather Bag", price: 4800, description: "A classic leather bag with a timeless design.", image: "https://picsum.photos/seed/product4/300/300", seller: "RetroFinds", dataAiHint: "leather bag", category: "Accessories", condition: "Fair", location: "Dadar" },
  { id: 5, name: "Bamboo Toothbrush Set", price: 960, description: "An eco-friendly alternative to plastic toothbrushes.", image: "https://picsum.photos/seed/product5/300/300", seller: "EcoEssentials", dataAiHint: "bamboo toothbrush", category: "Personal Care", condition: "New", location: "Thane" },
  { id: 6, name: "Second-hand Novel Set", price: 1440, description: "A collection of pre-loved novels for your reading pleasure.", image: "https://picsum.photos/seed/product6/300/300", seller: "BookCycle", dataAiHint: "books pile", category: "Books", condition: "Used", location: "Colaba" },
  { id: 7, name: "Refurbished Smartphone", price: 12000, description: "A high-quality, professionally refurbished smartphone.", image: "https://picsum.photos/seed/product7/300/300", seller: "GadgetCycle", dataAiHint: "smartphone hand", category: "Electronics", condition: "Good", location: "Goregaon" },
  { id: 8, name: "Upcycled Tire Chair", price: 6000, description: "A unique and sturdy chair made from upcycled car tires.", image: "https://picsum.photos/seed/product8/300/300", seller: "RevolveDesigns", dataAiHint: "tire chair", category: "Furniture", condition: "Used", location: "Chembur" },
];

const categories = ["Electronics", "Furniture", "Clothing", "Books", "Home Decor", "Kitchenware", "Accessories", "Personal Care"];
const conditions = ["New", "Good", "Fair", "Used"];

function Filters({
  selectedCategories,
  setSelectedCategories,
  selectedConditions,
  setSelectedConditions,
  priceRange,
  setPriceRange,
  handleReset,
}: {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedConditions: string[];
  setSelectedConditions: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  handleReset: () => void;
}) {
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleConditionChange = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="font-headline text-lg font-semibold">Filters</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" defaultValue={["category", "condition", "price"]} className="w-full">
          <AccordionItem value="category">
            <AccordionTrigger className="font-semibold">Category</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={category} className="font-normal">{category}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="condition">
            <AccordionTrigger className="font-semibold">Condition</AccordionTrigger>
            <AccordionContent className="pt-2 space-y-2">
              {conditions.map(condition => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={() => handleConditionChange(condition)}
                  />
                  <Label htmlFor={condition} className="font-normal">{condition}</Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger className="font-semibold">Price Range</AccordionTrigger>
            <AccordionContent className="pt-4">
              <Slider
                min={0}
                max={20000}
                step={500}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>₹{priceRange[0]}</span>
                <span>₹{priceRange[1]}</span>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex flex-col gap-2">
            <Button onClick={() => alert("Filters Applied!")}>Apply Filters</Button>
            <Button variant="ghost" onClick={handleReset}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
}


export default function MarketplacePage() {
  const { user } = useUser();
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

  useEffect(() => {
    try {
      const storedProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      // Combine initial products with user-added products, ensuring no duplicates
      const allProducts = [...initialProducts];
      const existingIds = new Set(allProducts.map(p => p.id));
      for (const p of storedProducts) {
        if (!existingIds.has(p.id)) {
          allProducts.push(p);
        }
      }
      setProducts(allProducts);
    } catch (error) {
      console.error("Failed to parse products from localStorage", error);
      setProducts(initialProducts);
    }
  }, []);

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange([0, 20000]);
  };

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const conditionMatch = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && conditionMatch && priceMatch;
  });

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block lg:col-span-1">
                 <Filters 
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedConditions={selectedConditions}
                    setSelectedConditions={setSelectedConditions}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    handleReset={handleReset}
                 />
            </aside>
            <main className="lg:col-span-3">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold font-headline">Featured Products</h2>
                     <Sheet>
                      <SheetTrigger asChild>
                         <Button variant="outline" className="lg:hidden">
                            <ListFilter className="mr-2 h-4 w-4" /> Filters
                          </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                            <Filters 
                                selectedCategories={selectedCategories}
                                setSelectedCategories={setSelectedCategories}
                                selectedConditions={selectedConditions}
                                setSelectedConditions={setSelectedConditions}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                handleReset={handleReset}
                             />
                        </div>
                      </SheetContent>
                    </Sheet>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group overflow-hidden flex flex-col">
                      <CardHeader className="p-0">
                        <div className="relative aspect-video">
                          <Image src={product.image} alt={product.name} fill className="object-cover transition-transform group-hover:scale-105" data-ai-hint={product.dataAiHint}/>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold truncate text-base">{product.name}</h3>
                         <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            <p>Category: <span className="font-medium text-foreground">{product.category}</span></p>
                            <p>Location: <span className="font-medium text-foreground">{product.location}</span></p>
                            <p>Condition: <span className="font-medium text-foreground">{product.condition}</span></p>
                        </div>
                        <div className="flex-grow"></div>
                        <div className="flex justify-between items-center mt-4">
                          <p className="font-bold text-xl text-primary">₹{product.price}</p>
                           <Button variant="default" size="sm" onClick={() => user ? alert('This will be added to cart!') : alert('Please log in to add items to your cart.')}>
                            Add to cart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No products match the selected filters.</p>
                    </div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
}

    