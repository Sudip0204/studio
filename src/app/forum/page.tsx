
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function ForumPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center border-b">
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">Community Forum</CardTitle>
          <CardDescription>This feature is currently under construction.</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <p className="text-muted-foreground">Coming soon!</p>
        </CardContent>
      </Card>
    </div>
  );
}
