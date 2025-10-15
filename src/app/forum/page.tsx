
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function ForumPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Community Forum</CardTitle>
          <CardDescription>Coming Soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A space for our eco-community to connect, share tips, and discuss sustainability is on its way. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
