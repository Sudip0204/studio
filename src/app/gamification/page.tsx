
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { EcoSnakeGame } from "@/components/gamification/eco-snake-game";
import { Leaderboard } from "@/components/gamification/leaderboard";
import { Separator } from "@/components/ui/separator";

export default function GamificationPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <Trophy className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">EcoSnake</CardTitle>
              <CardDescription className="text-lg">
                Play, collect waste, and help clean our virtual city!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EcoSnakeGame />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
