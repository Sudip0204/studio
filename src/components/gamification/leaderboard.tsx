
'use client';

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Loader2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

const getRankIcon = (rank: number) => {
  if (rank === 0) return <Crown className="h-5 w-5 text-amber-400" />;
  if (rank === 1) return <Crown className="h-5 w-5 text-slate-400" />;
  if (rank === 2) return <Crown className="h-5 w-5 text-amber-600" />;
  return <span className="font-bold text-sm w-5 text-center">{rank + 1}</span>;
};

// Ready-made scores for demonstration
const readyMadeScores = [
  { id: 'user-1', name: 'Alex', photoURL: 'https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=600', highestScore: 250 },
  { id: 'user-2', name: 'Maria', photoURL: 'https://images.unsplash.com/photo-1635131902146-6957477a4ff4?q=80&w=600', highestScore: 220 },
  { id: 'user-3', name: 'Sam', photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600', highestScore: 190 },
  { id: 'user-4', name: 'Jordan', photoURL: 'https://images.unsplash.com/photo-1590086782792-42dd2350140d?q=80&w=600', highestScore: 150 },
  { id: 'user-5', name: 'Chloe', photoURL: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=600', highestScore: 120 },
];

export function Leaderboard() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const leaderboardRef = useMemoFirebase(() => collection(firestore, 'leaderboard'), [firestore]);
  const leaderboardQuery = useMemoFirebase(() => query(leaderboardRef, orderBy('highestScore', 'desc'), limit(10)), [leaderboardRef]);

  const { data: leaderboardData, isLoading } = useCollection(leaderboardQuery);

  const combinedLeaderboard = useMemo(() => {
    const allScores = [...readyMadeScores, ...(leaderboardData || [])];
    
    // Remove duplicates, giving preference to real data from Firebase
    const uniqueScores = allScores.reduce((acc, current) => {
        if (!acc.find(item => item.id === current.id)) {
            acc.push(current);
        }
        return acc;
    }, [] as typeof allScores);

    // Sort by score and take the top 10
    return uniqueScores.sort((a, b) => b.highestScore - a.highestScore).slice(0, 10);
  }, [leaderboardData]);


  return (
    <Card className="bg-muted/50">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2">
            <Trophy className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Leaderboard</CardTitle>
        <CardDescription>Top EcoSnake Players</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isLoading && (
            [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-background">
                    <Skeleton className="w-6 h-6" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                </div>
            ))
          )}

          {!isLoading && combinedLeaderboard && combinedLeaderboard.map((player, index) => {
             const isCurrentUser = currentUser?.uid === player.id;
            return (
              <div 
                key={player.id} 
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-all",
                  isCurrentUser ? "bg-primary/20 border-2 border-primary" : "bg-background"
                )}
              >
                <div className="w-6 flex justify-center items-center">
                  {getRankIcon(index)}
                </div>
                <Avatar className="h-10 w-10 border-2 border-muted">
                    {player.photoURL && <AvatarImage src={player.photoURL} alt={player.name} />}
                   <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className={cn("font-semibold", isCurrentUser && "text-primary-foreground")}>{isCurrentUser ? 'You' : player.name}</p>
                   <p className={cn("text-xs text-muted-foreground", isCurrentUser && "text-primary-foreground/80")}>Eco-Warrior</p>
                </div>
                <div className="flex items-center gap-2 font-bold text-primary">
                    <Trophy className="h-4 w-4 text-amber-500"/>
                    <span>{(player.highestScore || 0).toLocaleString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
