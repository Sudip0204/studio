
'use client';

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

export function Leaderboard() {
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const usersRef = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const leaderboardQuery = useMemoFirebase(() => query(usersRef, orderBy('highestScore', 'desc'), limit(10)), [usersRef]);

  const { data: leaderboardData, isLoading } = useCollection(leaderboardQuery);

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

          {!isLoading && leaderboardData && leaderboardData.map((player, index) => {
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
