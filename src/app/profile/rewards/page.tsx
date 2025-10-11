import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export default function RewardsPage() {
  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Award className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl mt-4">Rewards Program</CardTitle>
          <CardDescription>Coming Soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our rewards program will soon be live, allowing you to earn Eco-points for your sustainable actions. Stay tuned for leaderboards, challenges, and exciting rewards!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
