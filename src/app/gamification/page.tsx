
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Leaderboard } from "@/components/gamification/leaderboard";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const EcoSnakeGame = dynamic(
  () => import('@/components/gamification/eco-snake-game').then(mod => mod.EcoSnakeGame),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center">
        <Skeleton className="w-full max-w-lg h-16 mb-4" />
        <Skeleton style={{ width: 480, height: 480 }} className="rounded-lg" />
        <Skeleton className="w-full max-w-lg h-6 mt-4" />
      </div>
    )
  }
);

export default function GamificationPage() {
  return (
    <div className="w-full">
        <EcoSnakeGame />
        <div className="container mx-auto py-12 px-4">
            <Leaderboard />
        </div>
    </div>
  );
}
