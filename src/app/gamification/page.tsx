
'use client';

import { Leaderboard } from "@/components/gamification/leaderboard";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const EcoSnakeGame = dynamic(
  () => import('@/components/gamification/eco-snake-game').then(mod => mod.EcoSnakeGame),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <Skeleton className="w-full max-w-lg h-16 mb-4" />
        <Skeleton style={{ width: 480, height: 480 }} className="rounded-lg" />
        <Skeleton className="w-full max-w-lg h-6 mt-4" />
      </div>
    )
  }
);

export default function GamificationPage() {
  return (
    <div className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <EcoSnakeGame />
            </div>
            <div className="lg:col-span-1">
                <Leaderboard />
            </div>
        </div>
    </div>
  );
}
