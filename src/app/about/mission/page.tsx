
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Target className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Our Mission</CardTitle>
          <CardDescription>Simplifying Sustainability for a Better Tomorrow</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            At EcoCity, our mission is to empower individuals with the knowledge and tools to make a positive environmental impact. We believe that small, collective actions can lead to significant global change. We're dedicated to making sustainable living accessible, rewarding, and straightforward for everyone.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
