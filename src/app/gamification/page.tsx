
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Play, Trophy, HelpCircle, Repeat, Trash2, Bot, Leaf, Circle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { LeaderboardEntry } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


type GameScreen = "main-menu" | "in-game" | "game-over";

const bins = [
    { name: "Paper", icon: <Trash2 />, color: "bg-blue-500" },
    { name: "Plastic/Metal", icon: <Bot />, color: "bg-yellow-500" },
    { name: "Glass", icon: <Circle />, color: "bg-gray-500" },
    { name: "Compost", icon: <Leaf />, color: "bg-green-500" },
    { name: "Landfill", icon: <Minus />, color: "bg-red-500" },
];


export default function GamificationPage() {
  const [screen, setScreen] = useState<GameScreen>('main-menu');
  const [lastScore, setLastScore] = useState(0);

  const handleGameOver = () => {
    const score = Math.floor(Math.random() * 500); // Simulate a score
    setLastScore(score);
    setScreen('game-over');
  };

  const renderScreen = () => {
    switch(screen) {
      case 'main-menu':
        return <MainMenu onPlay={() => setScreen('in-game')} />;
      case 'in-game':
        return <InGameUI onGameOver={handleGameOver} />;
      case 'game-over':
        return (
          <GameOverScreen 
            score={lastScore} 
            onPlayAgain={() => setScreen('in-game')}
            onMainMenu={() => setScreen('main-menu')}
          />
        );
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center">
        <div className="w-full max-w-4xl">
             <Card className="overflow-hidden shadow-2xl">
                <CardHeader className="text-center bg-muted/50">
                    <CardTitle className="font-headline text-4xl text-primary">The Recycling Sorter</CardTitle>
                    <CardDescription>Drag and drop the trash into the correct bin!</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="md:col-span-2 relative aspect-[4/5] w-full bg-gray-200 flex items-center justify-center">
                            {renderScreen()}
                        </div>
                        <aside className="md:col-span-1 p-4 bg-muted/30 border-l">
                            <Leaderboard />
                            <HowToPlay />
                        </aside>
                    </div>
                </CardContent>
             </Card>
        </div>
    </div>
  );
}

function MainMenu({ onPlay }: { onPlay: () => void }) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-200">
        <h2 className="text-3xl font-bold font-headline mb-8">Ready to Sort?</h2>
        <Button onClick={onPlay} size="lg" className="w-full text-lg py-8">
            <Play className="mr-2"/> START GAME
        </Button>
      </div>
    );
}

function InGameUI({ onGameOver }: { onGameOver: () => void }) {
    return (
        <div className="w-full h-full relative p-4 flex flex-col">
            {/* Game Info Header */}
            <div className="flex justify-between items-center text-lg font-bold p-4 bg-black/10 rounded-lg">
                <div>Time: <span className="font-mono">59s</span></div>
                <div>Score: <span className="font-mono">120</span></div>
            </div>

            {/* Falling Item Area (Placeholder) */}
            <div className="flex-grow flex items-center justify-center">
                <p className="text-muted-foreground italic">(Game area where items fall)</p>
            </div>

             {/* This button is for simulation purposes to end the game */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                 <Button onClick={onGameOver}>Simulate Game Over</Button>
            </div>

            {/* Bins */}
            <div className="grid grid-cols-5 gap-2 mt-auto">
                {bins.map(bin => (
                    <div key={bin.name} className={cn("p-2 rounded-lg text-white text-center h-24 flex flex-col justify-center items-center", bin.color)}>
                        {bin.icon}
                        <span className="text-xs font-semibold mt-1">{bin.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function GameOverScreen({ score, onPlayAgain, onMainMenu }: any) {
  return (
     <div className="w-full h-full bg-black/70 text-white flex flex-col items-center justify-center p-8 text-center z-10 absolute inset-0">
        <h2 className="text-5xl font-bold font-headline text-red-500 drop-shadow-lg">GAME OVER</h2>
        
        <Card className="mt-8 bg-background/90 border-gray-600 text-foreground w-full max-w-xs">
            <CardHeader>
                <CardTitle className="text-xl">Your Score</CardTitle>
                <CardDescription className="text-5xl font-bold text-primary">{score.toLocaleString()}</CardDescription>
            </CardHeader>
        </Card>
        
        <div className="mt-8 space-y-4 w-full max-w-xs">
            <Button onClick={() => alert("This would submit the score to Firestore.")} size="lg" className="w-full text-lg py-6">
                <Trophy className="mr-2"/> SUBMIT SCORE
            </Button>
             <Button onClick={onPlayAgain} size="lg" variant="secondary" className="w-full text-lg py-6">
                <Repeat className="mr-2"/> PLAY AGAIN
            </Button>
            <Button onClick={onMainMenu} size="lg" variant="ghost" className="w-full text-lg py-6">
                Back to Menu
            </Button>
        </div>
    </div>
  );
}

function Leaderboard() {
  const firestore = useFirestore();
  const { user } = useUser();

  const leaderboardQuery = useMemoFirebase(() => 
    query(collection(firestore, 'leaderboard'), orderBy('score', 'desc'), limit(10)),
    [firestore]
  );
  const { data: leaderboardData, isLoading } = useCollection<LeaderboardEntry>(leaderboardQuery);

  return (
    <div className="mb-6">
        <h3 className="font-headline text-xl font-semibold mb-2 flex items-center gap-2"><Trophy className="text-primary"/>Leaderboard</h3>
        <Card className="bg-background">
            <CardContent className="p-0">
                 {isLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                 ) : (
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead>Player</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboardData && leaderboardData.length > 0 ? leaderboardData.map((player, index) => (
                            <TableRow key={player.userId + index} className={cn(player.userId === user?.uid && 'bg-primary/10')}>
                                <TableCell className="font-bold">{index + 1}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={`https://i.pravatar.cc/40?u=${player.userId}`} />
                                            <AvatarFallback>{player.username[0]}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-sm truncate">{player.username}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono font-semibold">{player.score.toLocaleString()}</TableCell>
                            </TableRow>
                        )) : (
                           <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">Be the first to set a score!</TableCell>
                           </TableRow>
                        )}
                    </TableBody>
                </Table>
                 )}
            </CardContent>
        </Card>
    </div>
  );
}

function HowToPlay() {
    return (
        <div>
            <h3 className="font-headline text-xl font-semibold mb-2 flex items-center gap-2"><HelpCircle className="text-primary"/>How to Play</h3>
            <Card>
                <CardContent className="p-4 text-sm space-y-2 text-muted-foreground">
                    <p>🗑️ Trash items will fall from the top.</p>
                    <p>👆 Drag and drop each item into the correct bin at the bottom.</p>
                    <p>✅ Correct sorts earn points!</p>
                    <p>❌ Incorrect sorts lose points and show a helpful fact.</p>
                    <p>⏱️ Score as high as you can before time runs out!</p>
                </CardContent>
            </Card>
        </div>
    );
}

    