import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

export default function AiIdentifierPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Camera className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">AI Waste Identifier</CardTitle>
          <CardDescription>This feature is coming soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our AI-powered tool will soon be available to help you classify waste materials instantly. Just snap a photo, and we'll tell you how to dispose of it correctly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
