
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Shield, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const leaderboardData = [
  { rank: 1, name: "EcoWarrior", score: 12580, avatarId: "testimonial-1" },
  { rank: 2, name: "GreenGuardian", score: 11230, avatarId: "testimonial-2" },
  { rank: 3, name: "RecycleRex", score: 9840, avatarId: "user-3" },
  { rank: 4, name: "You", score: 8500, avatarId: "user-you" },
  { rank: 5, name: "CaptainPlanet", score: 7600, avatarId: "user-5" },
  { rank: 6, name: "SortMaster", score: 6210, avatarId: "user-6" },
  { rank: 7, name: "WasteWatcher", score: 5550, avatarId: "user-7" },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-amber-400" />;
  if (rank === 2) return <Crown className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Crown className="h-5 w-5 text-amber-600" />;
  return <span className="font-bold text-sm w-5 text-center">{rank}</span>;
};


export function Leaderboard() {
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
          {leaderboardData.map((player, index) => {
             const avatarImage = PlaceHolderImages.find(p => p.id === player.avatarId);
             const isCurrentUser = player.name === "You";
            return (
              <div 
                key={index} 
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-all",
                  isCurrentUser ? "bg-primary/20 border-2 border-primary" : "bg-background"
                )}
              >
                <div className="w-6 flex justify-center items-center">
                  {getRankIcon(player.rank)}
                </div>
                <Avatar className="h-10 w-10 border-2 border-muted">
                    {avatarImage && <AvatarImage src={avatarImage.imageUrl} alt={player.name} data-ai-hint={avatarImage.imageHint} />}
                   <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className={cn("font-semibold", isCurrentUser && "text-primary-foreground")}>{player.name}</p>
                   <p className={cn("text-xs text-muted-foreground", isCurrentUser && "text-primary-foreground/80")}>Eco-Warrior</p>
                </div>
                <div className="flex items-center gap-2 font-bold text-primary">
                    <Trophy className="h-4 w-4 text-amber-500"/>
                    <span>{player.score.toLocaleString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
