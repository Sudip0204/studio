
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, Clock, Phone, Heart, Globe, Home, Loader2 } from "lucide-react";
import { recyclingCenters, RecyclingCenter } from './data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Haversine formula to calculate distance between two lat/lng points
const haversineDistance = (
  coords1: { lat: number; lng: number },
  coords2: { lat: number; lng: number }
): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;

  const R = 6371; // Earth's radius in km
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function RecyclingCentersPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  
  // For demonstration, we'll use a hardcoded address input that resolves to a known location.
  // In a real app, this would use a Geocoding API.
  const [manualAddress, setManualAddress] = useState("New York, NY"); 

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };
  
  const handleFetchLocation = useCallback(() => {
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
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setManualAddress("Your Current Location");
        toast({ title: "Location Found", description: "Searching for centers near you."});
        setIsLocating(false);
      },
      (error) => {
        toast({
            variant: 'destructive',
            title: 'Location Access Denied',
            description: 'Please enable location permissions to use this feature.',
        });
        setIsLocating(false);
      }
    );
  }, [toast]);
  
  const handleManualSearch = () => {
      // In a real app, you'd use a geocoding API to convert `manualAddress` to lat/lng.
      // For this prototype, we'll simulate it by setting a fixed location.
      if (manualAddress.toLowerCase().includes("new york")) {
        setUserLocation({ lat: 40.7128, lng: -74.0060 });
        toast({ title: "Location Set", description: `Searching for centers near ${manualAddress}`});
      } else {
        toast({ variant: 'destructive', title: "Location not found", description: "Please enter a valid address like 'New York, NY'."});
      }
  }

  useEffect(() => {
    // Automatically try to fetch location on initial load
    handleFetchLocation();
  }, [handleFetchLocation]);

  const nearbyCenters = useMemo(() => {
    if (!userLocation) {
      return recyclingCenters; // Return all if no location is set
    }
    return recyclingCenters.filter(center => {
      const distance = haversineDistance(userLocation, center.location);
      return distance <= 3; // Filter within 3km radius
    });
  }, [userLocation]);

  const filteredCenters = useMemo(() => {
    return nearbyCenters.filter(center =>
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, nearbyCenters]);

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
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="Enter address e.g. New York, NY"
                    disabled={isLocating}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                  />
                  <Button variant="outline" size="icon" onClick={handleFetchLocation} disabled={isLocating}>
                    {isLocating ? <Loader2 className="animate-spin" /> : <Globe />}
                  </Button>
                </div>
                 <Button onClick={handleManualSearch} className="w-full mt-3">Search Manually</Button>
                <p className="text-xs text-muted-foreground mt-2">Allow location access or enter an address manually and search.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                 <CardTitle className="font-headline">Nearby Centers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Filter results..." 
                      className="pl-10" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {userLocation && filteredCenters.length === 0 && (
                       <Alert>
                        <AlertTitle>No Centers Found</AlertTitle>
                        <AlertDescription>
                          No recycling centers were found within a 3km radius of your location. Try searching a different area.
                        </AlertDescription>
                      </Alert>
                    )}
                    {filteredCenters.map((center) => (
                        <div key={center.id} className="border p-4 rounded-lg hover:bg-muted/50 transition-colors">
                           <div className="flex justify-between items-start">
                             <div>
                                <h3 className="font-semibold">{center.name}</h3>
                                <p className="text-sm text-muted-foreground">{center.address}</p>
                                {userLocation && (
                                   <p className="text-xs font-bold text-primary mt-1">
                                      {haversineDistance(userLocation, center.location).toFixed(2)} km away
                                   </p>
                                )}
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
