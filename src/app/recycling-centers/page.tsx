
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Search, Star, Clock, Phone, Heart, Globe, Home, Loader2 } from "lucide-react";
import { recyclingCenters, RecyclingCenter } from './data';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function RecyclingCentersPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userAddress, setUserAddress] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };
  
  const handleFetchLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using a free, public reverse geocoding API (OpenStreetMap)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data.display_name) {
            setUserAddress(data.display_name);
          } else {
             setUserAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
             toast({
                title: "Location Found",
                description: "Could not find a street address for your coordinates.",
             });
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Could Not Fetch Address',
            description: 'There was a problem converting your location to an address.',
          });
        } finally {
            setIsLocating(false);
        }
      },
      (error) => {
        toast({
            variant: 'destructive',
            title: 'Location Access Denied',
            description: 'Please enable location permissions in your browser to use this feature.',
        });
        setIsLocating(false);
      }
    );
  };
  
  useEffect(() => {
    // Automatically try to fetch location on initial load
    handleFetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                    placeholder="Enter address or find me..."
                    disabled={isLocating}
                  />
                  <Button variant="outline" size="icon" onClick={handleFetchLocation} disabled={isLocating}>
                    {isLocating ? <Loader2 className="animate-spin" /> : <Globe />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Allow location access or enter your address manually.</p>
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
               </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
