
"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Star, Clock, Phone, Heart, Globe, Home, Loader2, Navigation, Info } from "lucide-react";
import { recyclingCenters, RecyclingCenter } from './data';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const allMaterials = Array.from(new Set(recyclingCenters.flatMap(center => center.acceptedMaterials)));

export default function RecyclingCentersPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  
  const [manualAddress, setManualAddress] = useState(""); 

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
        toast({ title: "Location Found", description: "Showing centers sorted by distance."});
        setIsLocating(false);
      },
      (error) => {
        toast({
            variant: 'destructive',
            title: 'Location Access Denied',
            description: 'Please enable location permissions or search manually.',
        });
        setIsLocating(false);
      }
    );
  }, [toast]);
  
  const handleManualSearch = () => {
      if (!manualAddress || manualAddress === "Your Current Location") {
        toast({ variant: 'destructive', title: "Invalid Address", description: "Please enter a location to search."});
        return;
      }
      // In a real app, you'd use a geocoding API to convert `manualAddress` to lat/lng.
      // For this prototype, we'll simulate it by setting a fixed location if it contains a known city.
      if (manualAddress.toLowerCase().includes("vashi")) {
        setUserLocation({ lat: 19.07, lng: 73.0 });
        toast({ title: "Location Set", description: `Searching for centers near ${manualAddress}`});
      } else if (manualAddress.toLowerCase().includes("andheri")) {
        setUserLocation({ lat: 19.11, lng: 72.86 });
        toast({ title: "Location Set", description: `Searching for centers near ${manualAddress}`});
      }
      else {
        toast({ title: "Showing All Centers", description: "Could not pinpoint location, showing all available centers."});
        setUserLocation(null);
      }
  }

  useEffect(() => {
    handleFetchLocation();
  }, [handleFetchLocation]);

  const sortedCenters = useMemo(() => {
    let centers = [...recyclingCenters];
    if (userLocation) {
      centers.sort((a, b) => {
        const distanceA = haversineDistance(userLocation, a.location);
        const distanceB = haversineDistance(userLocation, b.location);
        return distanceA - distanceB;
      });
    }
    return centers;
  }, [userLocation]);

  const filteredCenters = useMemo(() => {
    return sortedCenters.filter(center =>
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.acceptedMaterials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, sortedCenters]);

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

      <div className="container mx-auto py-12 px-4 max-w-7xl">
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Search className="text-primary"/> Search for a Center
                </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <label htmlFor="location-search" className="text-sm font-medium">Your Location</label>
                     <div className="flex gap-2 mt-2">
                        <Input 
                            id="location-search"
                            value={manualAddress}
                            onChange={(e) => setManualAddress(e.target.value)}
                            placeholder="Enter address e.g. Andheri, Mumbai"
                            disabled={isLocating}
                            onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                        />
                        <Button variant="outline" size="icon" onClick={handleFetchLocation} disabled={isLocating}>
                            {isLocating ? <Loader2 className="animate-spin" /> : <Globe />}
                        </Button>
                    </div>
                </div>
                <div>
                     <label htmlFor="filter-search" className="text-sm font-medium">Filter by Material</label>
                     <div className="relative mt-2">
                         <Select value={searchQuery} onValueChange={(value) => setSearchQuery(value === 'all' ? '' : value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a material" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Materials</SelectItem>
                                {allMaterials.map(material => (
                                    <SelectItem key={material} value={material}>{material}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        {filteredCenters.length === 0 && !isLocating && (
            <div className="text-center py-16">
                <p className="text-muted-foreground">No recycling centers found matching your criteria.</p>
            </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCenters.map(center => (
                <Card key={center.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="font-headline">{center.name}</CardTitle>
                             <Button size="icon" variant="ghost" onClick={() => toggleFavorite(center.id)}>
                                <Heart className={cn("h-5 w-5", favorites.includes(center.id) ? "text-red-500 fill-current" : "text-muted-foreground")} />
                             </Button>
                        </div>
                        <CardDescription className="flex items-start gap-2 pt-2">
                            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                            <span>{center.address}, {center.pincode}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{center.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{center.hours.open} - {center.hours.close}</span>
                        </div>
                         <div className="flex items-center gap-1 text-sm text-amber-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-bold">{center.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground text-xs">({center.reviews} reviews)</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-2">Accepts:</h4>
                            <div className="flex flex-wrap gap-2">
                                {center.acceptedMaterials.map(material => (
                                    <Badge key={material} variant="secondary">{material}</Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        {userLocation && (
                            <div className="text-sm font-bold text-primary">
                                {haversineDistance(userLocation, center.location).toFixed(1)} km away
                            </div>
                        )}
                        <Button asChild variant="outline">
                            <a href={`https://www.google.com/maps/search/?api=1&query=${center.name}, ${center.address}`} target="_blank" rel="noopener noreferrer">
                                <Navigation className="mr-2 h-4 w-4" />
                                Get Directions
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
