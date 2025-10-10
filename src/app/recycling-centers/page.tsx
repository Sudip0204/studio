import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export default function RecyclingCentersPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
           <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <MapPin className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Recycling Center Locator</CardTitle>
          <CardDescription>This feature is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Soon you'll be able to use our interactive map to find recycling centers near you, complete with operating hours and accepted materials.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
