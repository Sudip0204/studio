import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export default function CarbonCalculatorPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Calculator className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Carbon Calculator</CardTitle>
          <CardDescription>This feature is being developed.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Soon, you'll be able to track your environmental impact with our Carbon Calculator. Understand your carbon footprint and learn how to reduce it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
