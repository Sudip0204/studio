import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function MarketplacePage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
           <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <ShoppingCart className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Marketplace</CardTitle>
          <CardDescription>This feature is in the works!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Get ready to buy and sell second-hand items within the EcoCity community. Our marketplace to promote reuse is coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
