
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function ForumPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Community Forum</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The community forum content has been removed. This space is ready for new ideas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
