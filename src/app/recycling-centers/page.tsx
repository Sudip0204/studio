"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Search, Star, Clock, Phone, Heart, Globe, Home } from "lucide-react";
import { recyclingCenters, RecyclingCenter } from './data';
import Image from 'next/image';
import Link from 'next/link';

export default function RecyclingCentersPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userAddress, setUserAddress] = useState("New York, NY 10001");

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-background">
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto text-center">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <MapPin className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                Find a Recycling Center
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
                Enter your location to find the nearest centers, view their details, and get directions.
            </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Home className="text-primary"/> Your Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    value={userAddress}
                    onChange={(e) => setUserAddress(e.target.value)}
                    placeholder="Enter your address or zip code"
                  />
                  <Button variant="outline" size="icon">
                    <Globe />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Set your home address for quick access.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle className="font-headline">Nearby Centers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search centers..." className="pl-10" />
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {recyclingCenters.map((center) => (
                        <div key={center.id} className="border p-4 rounded-lg hover:bg-muted/50 transition-colors">
                           <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-semibold">{center.name}</h3>
                                <p className="text-sm text-muted-foreground">{center.address}</p>
                             </div>
                             <Button size="icon" variant="ghost" onClick={() => toggleFavorite(center.id)}>
                                <Heart className={cn("h-5 w-5", favorites.includes(center.id) ? "text-red-500 fill-current" : "text-muted-foreground")} />
                             </Button>
                           </div>
                           <div className="flex items-center gap-1 text-sm mt-2 text-amber-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span>{center.rating.toFixed(1)}</span>
                                <span className="text-muted-foreground text-xs">({center.reviews} reviews)</span>
                           </div>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="h-[400px] lg:h-full">
               <CardContent className="p-0 h-full rounded-lg overflow-hidden relative flex items-center justify-center bg-muted">
                    <Image 
                      src="https://picsum.photos/seed/mapview/1200/800" 
                      alt="Map of recycling centers"
                      fill
                      className="object-cover"
                      data-ai-hint="map satellite"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                     <div className="relative text-center text-white p-4">
                       <h3 className="font-headline text-2xl">Map View Coming Soon</h3>
                       <p>Interactive map will be available here.</p>
                     </div>
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}