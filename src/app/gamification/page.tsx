
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { EcoSnakeGame } from "@/components/gamification/eco-snake-game";

export default function GamificationPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
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
    </div>
  );
}
