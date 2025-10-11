import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export default function GamificationPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Gamification</CardTitle>
          <CardDescription>Coming Soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Get ready to take on challenges, earn badges, and compete with the community. Making a difference has never been this fun!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
