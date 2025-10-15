
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Footprints, Car, Plane, Home, Salad, ShoppingCart, Info, Lightbulb, BarChart3, TrendingDown, Repeat } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const EMISSION_FACTORS = {
  // Transport (kg CO2e per km)
  car_petrol: 0.17,
  car_diesel: 0.19,
  car_electric: 0.05, // Varies hugely by grid
  flight_short: 0.25, // < 3700km
  flight_long: 0.19, // > 3700km

  // Home Energy (kg CO2e per unit)
  electricity: 0.71, // India's average kg CO2e per kWh

  // Diet (kg CO2e per week)
  diet_meat_high: 60, // Assumes daily meat
  diet_meat_medium: 40,
  diet_meat_low: 25,
  diet_vegetarian: 15,
  diet_vegan: 10,

  // Shopping (kg CO2e per item)
  shopping_electronics: 50,
  shopping_clothing: 10,
  shopping_furniture: 80,
  shopping_other: 5,
};

const averageFootprint = {
  india: 1900,
  world: 4000,
};

type FormData = {
  // Transport
  car_km: number;
  car_fuel: keyof typeof EMISSION_FACTORS | 'none';
  flight_short_hours: number;
  flight_long_hours: number;
  // Energy
  electricity_kwh: number;
  // Diet
  diet: keyof typeof EMISSION_FACTORS;
  // Shopping
  shopping_electronics: number;
  shopping_clothing: number;
};

const initialState: FormData = {
  car_km: 0,
  car_fuel: 'none',
  flight_short_hours: 0,
  flight_long_hours: 0,
  electricity_kwh: 0,
  diet: 'diet_meat_medium',
  shopping_electronics: 0,
  shopping_clothing: 0,
};

export default function CarbonCalculatorPage() {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [footprint, setFootprint] = useState({
    transport: 0,
    energy: 0,
    diet: 0,
    shopping: 0,
    total: 0,
  });

  const handleCalculate = () => {
    const transport = 
      (formData.car_km * (EMISSION_FACTORS[formData.car_fuel as keyof typeof EMISSION_FACTORS] || 0) * 52) + // weekly km to yearly
      (formData.flight_short_hours * 900 * EMISSION_FACTORS.flight_short) + // Assuming avg speed 900km/h
      (formData.flight_long_hours * 900 * EMISSION_FACTORS.flight_long);

    const energy = formData.electricity_kwh * 12 * EMISSION_FACTORS.electricity; // monthly kWh to yearly

    const diet = (EMISSION_FACTORS[formData.diet as keyof typeof EMISSION_FACTORS] || 0) * 52; // weekly to yearly

    const shopping = 
      (formData.shopping_electronics * EMISSION_FACTORS.shopping_electronics) +
      (formData.shopping_clothing * EMISSION_FACTORS.shopping_clothing);

    const total = transport + energy + diet + shopping;
    
    setFootprint({ transport, energy, diet, shopping, total });
  };

  const handleReset = () => {
    setFormData(initialState);
    setFootprint({ transport: 0, energy: 0, diet: 0, shopping: 0, total: 0 });
  };
  
  const chartData = [
    { name: 'Transport', value: (footprint.transport / 1000).toFixed(2), fill: 'var(--color-transport)' },
    { name: 'Energy', value: (footprint.energy / 1000).toFixed(2), fill: 'var(--color-energy)' },
    { name: 'Diet', value: (footprint.diet / 1000).toFixed(2), fill: 'var(--color-diet)' },
    { name: 'Shopping', value: (footprint.shopping / 1000).toFixed(2), fill: 'var(--color-shopping)' },
  ];

  return (
    <div className="bg-muted/30">
      <style>{`
        :root {
            --color-transport: hsl(211 78% 46%);
            --color-energy: hsl(35 100% 57%);
            --color-diet: hsl(123 44% 34%);
            --color-shopping: hsl(346 84% 60%);
        }
      `}</style>
      <section className="bg-primary/10 py-16 text-center">
        <div className="container mx-auto">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <Footprints className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
                Carbon Footprint Calculator
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
                Discover your environmental impact and learn how to reduce it. Small changes can make a world of difference.
            </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Left side: Calculator */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Your Lifestyle</CardTitle>
                        <CardDescription>Fill in your details below to estimate your annual carbon footprint.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="transport" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="transport"><Car className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Transport</span></TabsTrigger>
                                <TabsTrigger value="energy"><Home className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Energy</span></TabsTrigger>
                                <TabsTrigger value="diet"><Salad className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Diet</span></TabsTrigger>
                                <TabsTrigger value="shopping"><ShoppingCart className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Shopping</span></TabsTrigger>
                            </TabsList>
                            <TabsContent value="transport" className="pt-6 space-y-6">
                               <div className="space-y-2">
                                  <Label className="flex items-center gap-2"><Plane /> Annual Flights</Label>
                                  <div className="grid grid-cols-2 gap-4">
                                    <Input type="number" placeholder="Short-haul hours (e.g. 4)" onChange={(e) => setFormData({...formData, flight_short_hours: Number(e.target.value)})} />
                                    <Input type="number" placeholder="Long-haul hours (e.g. 12)" onChange={(e) => setFormData({...formData, flight_long_hours: Number(e.target.value)})} />
                                  </div>
                               </div>
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-2"><Car /> Weekly Car Travel</Label>
                                   <div className="grid grid-cols-2 gap-4">
                                    <Input type="number" placeholder="Distance in km (e.g. 50)" onChange={(e) => setFormData({...formData, car_km: Number(e.target.value)})} />
                                    <Select onValueChange={(val) => setFormData({...formData, car_fuel: val as FormData['car_fuel']})}>
                                      <SelectTrigger><SelectValue placeholder="Fuel Type" /></SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="none">No Car</SelectItem>
                                        <SelectItem value="car_petrol">Petrol</SelectItem>
                                        <SelectItem value="car_diesel">Diesel</SelectItem>
                                        <SelectItem value="car_electric">Electric</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                               </div>
                            </TabsContent>
                            <TabsContent value="energy" className="pt-6 space-y-4">
                               <div className="space-y-2">
                                  <Label className="flex items-center gap-2"><Home /> Monthly Electricity</Label>
                                  <Input type="number" placeholder="Electricity usage in kWh (e.g. 150)" onChange={(e) => setFormData({...formData, electricity_kwh: Number(e.target.value)})} />
                                  <p className="text-xs text-muted-foreground">Check your electricity bill for this information.</p>
                               </div>
                            </TabsContent>
                            <TabsContent value="diet" className="pt-6 space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Salad /> Dietary Habits</Label>
                                    <Select onValueChange={(val) => setFormData({...formData, diet: val as FormData['diet']})}>
                                        <SelectTrigger><SelectValue placeholder="Describe your diet" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="diet_meat_high">I eat meat almost every day</SelectItem>
                                            <SelectItem value="diet_meat_medium">I eat meat a few times a week</SelectItem>
                                            <SelectItem value="diet_meat_low">I rarely eat meat (once a week)</SelectItem>
                                            <SelectItem value="diet_vegetarian">I am vegetarian</SelectItem>
                                            <SelectItem value="diet_vegan">I am vegan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>
                            <TabsContent value="shopping" className="pt-6 space-y-6">
                               <div className="space-y-2">
                                  <Label className="flex items-center gap-2"><ShoppingCart /> Annual Shopping</Label>
                                  <div className="grid grid-cols-2 gap-4">
                                     <Input type="number" placeholder="# of new electronics" onChange={(e) => setFormData({...formData, shopping_electronics: Number(e.target.value)})} />
                                     <Input type="number" placeholder="# of new clothing items" onChange={(e) => setFormData({...formData, shopping_clothing: Number(e.target.value)})} />
                                  </div>
                               </div>
                            </TabsContent>
                        </Tabs>

                         <div className="flex gap-4 pt-6">
                            <Button onClick={handleCalculate} className="w-full">Calculate Footprint</Button>
                            <Button onClick={handleReset} variant="outline" className="w-full">Reset</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right side: Results & Info */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2"><BarChart3 className="text-primary"/> Your Annual Footprint</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-5xl font-bold text-primary">{(footprint.total / 1000).toFixed(2)}</p>
                        <p className="text-muted-foreground">tonnes of CO₂e</p>

                        <div className="h-64 mt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ left: -10 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--foreground))', fontSize: 14}} width={80} />
                                    <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                         <div className="text-sm text-muted-foreground mt-4 text-left p-4 bg-background rounded-lg">
                           Your footprint is compared to the average in India (~{averageFootprint.india/1000} tonnes) and the world average (~{averageFootprint.world/1000} tonnes).
                        </div>
                    </CardContent>
                </Card>

                 {footprint.total > 0 && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><TrendingDown className="text-primary"/> How to Reduce Your Footprint</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           {footprint.transport > (footprint.total * 0.3) && <p className="text-sm flex gap-2"><Car className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Consider using public transport, carpooling, or cycling for shorter trips.</p>}
                           {footprint.energy > (footprint.total * 0.3) && <p className="text-sm flex gap-2"><Home className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Switch to energy-efficient appliances and remember to turn off lights when not in use.</p>}
                           {footprint.diet > (footprint.total * 0.2) && <p className="text-sm flex gap-2"><Salad className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Reducing meat consumption, even for one day a week, can make a big impact.</p>}
                           {footprint.shopping > (footprint.total * 0.15) && <p className="text-sm flex gap-2"><ShoppingCart className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Choose second-hand items from our marketplace and repair instead of replacing.</p>}
                           <p className="text-sm flex gap-2"><Repeat className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" /> Reducing, Reusing, and Recycling are powerful ways to lower your overall footprint.</p>
                        </CardContent>
                     </Card>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}
