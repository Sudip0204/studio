
"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Play, Trophy, HelpCircle, Power, Loader2, Star, Shield, Repeat, Gift, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { LeaderboardEntry } from '@/lib/types';


type GameScreen = "main-menu" | "in-game" | "game-over" | "leaderboard" | "how-to-play";

const placeholderLeaderboard = [
  { rank: 1, username: "EcoWarrior", score: 156780, avatar: "https://picsum.photos/seed/leader1/40/40" },
  { rank: 2, username: "RecycleQueen", score: 149230, avatar: "https://picsum.photos/seed/leader2/40/40" },
  { rank: 3, username: "GreenNinja", score: 148500, avatar: "https://picsum.photos/seed/leader3/40/40" },
  { rank: 4, username: "You", score: 125480, avatar: "https://picsum.photos/seed/you/40/40" },
  { rank: 5, username: "TrashTornado", score: 110950, avatar: "https://picsum.photos/seed/leader5/40/40" },
  { rank: 6, username: "CaptainPlanet", score: 98760, avatar: "https://picsum.photos/seed/leader6/40/40" },
  { rank: 7, username: "EnviroGirl", score: 95430, avatar: "https://picsum.photos/seed/leader7/40/40" },
];


export default function GamificationPage() {
  const { user, isUserLoading } = useUser();
  const [screen, setScreen] = useState<GameScreen>('main-menu');
  const [lastScore, setLastScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  
  // A mock function to simulate ending a game
  const handleGameOver = () => {
    const score = Math.floor(Math.random() * 20000);
    setLastScore(score);
    // Simulate new high score 30% of the time
    if (score > 125480) {
        setIsNewHighScore(true);
    } else {
        setIsNewHighScore(false);
    }
    setScreen('game-over');
  };

  const toggleFullScreen = () => {
    const elem = gameContainerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);
  
  const renderScreen = () => {
    switch(screen) {
      case 'main-menu':
        return (
          <MainMenu 
            user={user} 
            isUserLoading={isUserLoading}
            onPlay={() => setScreen('in-game')}
            onLeaderboard={() => setScreen('leaderboard')}
            onHowToPlay={() => setScreen('how-to-play')}
          />
        );
      case 'in-game':
        // The actual game would be rendered here. We use a placeholder.
        return <InGameUI onGameOver={handleGameOver} />;
      case 'game-over':
        return (
          <GameOverScreen 
            score={lastScore} 
            isNewHighScore={isNewHighScore}
            onPlayAgain={() => setScreen('in-game')}
            onMainMenu={() => setScreen('main-menu')}
          />
        );
      case 'leaderboard':
        return <LeaderboardScreen onBack={() => setScreen('main-menu')} />;
      case 'how-to-play':
        return <HowToPlayScreen onBack={() => setScreen('main-menu')} />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden shadow-2xl bg-muted/30">
        <div ref={gameContainerRef} className="relative aspect-[5/8] w-full bg-gray-900 flex items-center justify-center">
            {renderScreen()}
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 text-white z-20 hover:bg-white/20"
              onClick={toggleFullScreen}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
            </Button>
        </div>
      </Card>
    </div>
  );
}


function MainMenu({ user, isUserLoading, onPlay, onLeaderboard, onHowToPlay }: any) {
  return (
    <div className="w-full h-full bg-black/50 text-white flex flex-col items-center justify-center p-8 text-center" style={{backgroundImage: "url('https://picsum.photos/seed/gamebg/500/900')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        <div className="relative z-10">
            <h1 className="text-5xl font-bold font-headline text-primary-foreground drop-shadow-lg">Eco-Runner</h1>
            <p className="text-primary-foreground/90 mt-1">The Clean City Dash</p>
            
            <div className="my-12 space-y-4">
                <Button onClick={onPlay} size="lg" className="w-full text-lg py-6 bg-green-500 hover:bg-green-600">
                    <Play className="mr-2"/> PLAY
                </Button>
                <Button onClick={onLeaderboard} size="lg" variant="secondary" className="w-full text-lg py-6">
                    <Trophy className="mr-2"/> LEADERBOARD & REWARDS
                </Button>
                 <Button onClick={onHowToPlay} size="lg" variant="secondary" className="w-full text-lg py-6">
                    <HelpCircle className="mr-2"/> HOW TO PLAY
                </Button>
            </div>

            {isUserLoading ? (
                 <Loader2 className="animate-spin" />
            ) : user ? (
                 <div className="flex items-center gap-4 bg-black/50 p-2 rounded-lg">
                    <Avatar>
                        <AvatarImage src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`} />
                        <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user.displayName || 'Eco Hero'}</p>
                        <p className="text-sm text-muted-foreground">High Score: <span className="font-bold text-white">125,480</span></p>
                    </div>
                </div>
            ) : (
                 <Button variant="outline" className="w-full bg-transparent text-white">Login to Save Progress</Button>
            )}
        </div>
    </div>
  );
}

function InGameUI({ onGameOver }: { onGameOver: () => void }) {
    // This component would render the actual game canvas.
    // For this prototype, it's a static image with UI overlay.
    return (
        <div className="w-full h-full relative">
            <Image src="https://i.imgur.com/gTGoTDB.jpeg" layout="fill" objectFit="cover" alt="Eco-runner game" />
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
                <div className="flex justify-between items-center text-white">
                    <div>
                        <p className="text-2xl font-bold">12,340</p>
                        <p className="text-sm text-amber-300">x2 Multiplier</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white" onClick={() => alert("Game Paused!\n(This would show a pause menu)")}>
                        <Power className="h-6 w-6" />
                    </Button>
                </div>
            </div>
             {/* This button is for simulation purposes to end the game */}
            <div className="absolute bottom-4 left-4 z-20">
                 <Button onClick={onGameOver}>Simulate Game Over</Button>
            </div>
        </div>
    );
}

function GameOverScreen({ score, isNewHighScore, onPlayAgain, onMainMenu }: any) {
  return (
     <div className="w-full h-full bg-black/70 text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-6xl font-bold font-headline text-red-500 drop-shadow-lg">GAME OVER</h1>
        
        <Card className="mt-8 bg-black/30 border-gray-600 text-white w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Your Score</CardTitle>
                <CardDescription className={cn("text-5xl font-bold", isNewHighScore ? 'text-amber-400' : 'text-white')}>{score.toLocaleString()}</CardDescription>
                {isNewHighScore && (
                    <p className="text-amber-400 font-semibold animate-pulse">New High Score!</p>
                )}
            </CardHeader>
        </Card>
        
        <div className="mt-8 space-y-4 w-full max-w-sm">
            <Button onClick={() => alert("This would call the 'submitGameScore' Cloud Function.")} size="lg" className="w-full text-lg py-6 bg-blue-500 hover:bg-blue-600">
                <Trophy className="mr-2"/> SUBMIT SCORE
            </Button>
             <Button onClick={onPlayAgain} size="lg" className="w-full text-lg py-6 bg-green-500 hover:bg-green-600">
                <Repeat className="mr-2"/> PLAY AGAIN
            </Button>
            <Button onClick={onMainMenu} size="lg" variant="secondary" className="w-full text-lg py-6">
                MAIN MENU
            </Button>
        </div>
    </div>
  );
}

function LeaderboardScreen({ onBack }: any) {
  const firestore = useFirestore();
  const { user } = useUser();

  const leaderboardQuery = useMemoFirebase(() => 
    query(collection(firestore, 'leaderboard'), orderBy('score', 'desc'), limit(100)),
    [firestore]
  );
  const { data: leaderboardData, isLoading } = useCollection<LeaderboardEntry>(leaderboardQuery);

  const top5 = useMemo(() => leaderboardData?.slice(0, 5) || [], [leaderboardData]);
  
  return (
    <div className="w-full h-full bg-gray-800 text-white flex flex-col items-center p-4 md:p-8">
        <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
                 <Button variant="ghost" onClick={onBack}>{"<"} Main Menu</Button>
                 <h1 className="text-3xl font-bold font-headline text-amber-400 drop-shadow-lg">Leaderboard</h1>
                 <div className="w-24"></div>
            </div>

            <Tabs defaultValue="all-time" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-700">
                    <TabsTrigger value="rewards">Rewards</TabsTrigger>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="all-time">All Time</TabsTrigger>
                </TabsList>

                <TabsContent value="rewards" className="mt-4">
                  <Card className="bg-black/30 border-amber-400/50">
                      <CardHeader className="text-center">
                          <Gift className="h-10 w-10 mx-auto text-amber-400" />
                          <CardTitle className="text-amber-400 font-headline">Top 5 Champions</CardTitle>
                          <CardDescription>The highest scorers get exciting gifts!</CardDescription>
                      </CardHeader>
                      <CardContent>
                          {isLoading ? <Loader2 className="mx-auto animate-spin" /> : (
                            <Table>
                              <TableHeader>
                                  <TableRow className="border-gray-600">
                                      <TableHead className="w-[50px]">Rank</TableHead>
                                      <TableHead>Player</TableHead>
                                      <TableHead className="text-right">Score</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {top5.map((player, index) => (
                                      <TableRow key={player.userId} className="border-gray-700 font-bold">
                                          <TableCell className="text-center text-amber-400">{index + 1}</TableCell>
                                          <TableCell>{player.username}</TableCell>
                                          <TableCell className="text-right font-mono">{player.score.toLocaleString()}</TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                          )}
                           {top5.length === 0 && !isLoading && <p className="text-center text-muted-foreground p-4">No scores submitted yet. Be the first!</p>}
                      </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="all-time" className="mt-4">
                    <Card className="bg-black/30 border-gray-600">
                        <CardContent className="p-0 max-h-[50vh] overflow-y-auto">
                             {isLoading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div> : (
                             <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-600 sticky top-0 bg-gray-800">
                                        <TableHead className="w-[50px]">Rank</TableHead>
                                        <TableHead>Player</TableHead>
                                        <TableHead className="text-right">Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {leaderboardData && leaderboardData.map((player, index) => (
                                        <TableRow key={player.userId + index} className={cn("border-gray-700", player.userId === user?.uid && 'bg-amber-500/20')}>
                                            <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={`https://i.pravatar.cc/40?u=${player.userId}`} />
                                                        <AvatarFallback>{player.username[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-semibold">{player.username}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">{player.score.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             )}
                             {leaderboardData?.length === 0 && !isLoading && <p className="text-center text-muted-foreground p-8">No scores submitted yet. Be the first!</p>}
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="daily"><p className="text-center text-muted-foreground p-8">Daily leaderboard coming soon!</p></TabsContent>
                 <TabsContent value="weekly"><p className="text-center text-muted-foreground p-8">Weekly leaderboard coming soon!</p></TabsContent>
            </Tabs>
        </div>
    </div>
  );
}


function HowToPlayScreen({ onBack }: any) {
  return (
    <div className="w-full h-full bg-gray-800 text-white flex flex-col items-center p-4 md:p-8">
       <div className="w-full max-w-md">
           <div className="flex items-center justify-between mb-4">
               <Button variant="ghost" onClick={onBack}>{"<"} Main Menu</Button>
               <h1 className="text-3xl font-bold font-headline text-amber-400 drop-shadow-lg">How to Play</h1>
               <div className="w-24"></div>
           </div>

           <Card className="bg-black/30 border-gray-600 text-lg">
                <CardContent className="p-6 space-y-4">
                    <p>🏃‍♂️ Your Eco-Hero runs automatically!</p>
                    <p> Swipe <span className="font-bold text-green-400">LEFT</span> or <span className="font-bold text-green-400">RIGHT</span> to switch lanes and collect waste.</p>
                    <p>⬆️ Swipe <span className="font-bold text-green-400">UP</span> to JUMP over obstacles like trash cans and benches.</p>
                    <p>⬇️ Swipe <span className="font-bold text-green-400">DOWN</span> to SLIDE under barriers.</p>
                    <p>♻️ Collect different types of waste to increase your score.</p>
                    <p>🚧 Avoid crashing into obstacles or the run is over!</p>
                </CardContent>
           </Card>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-center mb-4">Power-ups (Coming Soon!)</h2>
                 <div className="grid grid-cols-3 gap-4 text-center">
                    <Card className="bg-black/30 border-gray-600 p-4">
                        <Star className="h-8 w-8 mx-auto text-yellow-400" />
                        <p className="mt-2 font-semibold">Magnet</p>
                        <p className="text-xs text-muted-foreground">Collects waste automatically.</p>
                    </Card>
                    <Card className="bg-black/30 border-gray-600 p-4">
                        <Shield className="h-8 w-8 mx-auto text-blue-400" />
                        <p className="mt-2 font-semibold">Shield</p>
                        <p className="text-xs text-muted-foreground">Survive one crash.</p>
                    </Card>
                    <Card className="bg-black/30 border-gray-600 p-4">
                        <Crown className="h-8 w-8 mx-auto text-purple-400" />
                        <p className="mt-2 font-semibold">x2 Score</p>
                         <p className="text-xs text-muted-foreground">Doubles your score for a short time.</p>
                    </Card>
                 </div>
            </div>

       </div>
    </div>
  );
}

    

    

    

