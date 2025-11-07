
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Award, Play, RotateCw, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useDoc, updateDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

// Game constants
const GRID_SIZE = 20;
const INITIAL_TILE_SIZE = 24; // Base size of each grid cell in pixels
const GAME_SPEED = 150; // ms between game ticks

type Snake = { x: number; y: number }[];
type Food = { x: number; y: number; type: 'plastic' | 'paper' | 'can' };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const getRandomCoordinate = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const getRandomWasteType = (): Food['type'] => {
  const types: Food['type'][] = ['plastic', 'paper', 'can'];
  return types[Math.floor(Math.random() * types.length)];
};

const wasteImages = {
  plastic: PlaceHolderImages.find(p => p.id === 'waste-plastic'),
  paper: PlaceHolderImages.find(p => p.id === 'waste-paper'),
  can: PlaceHolderImages.find(p => p.id === 'waste-can'),
};

const wastePoints = {
  plastic: 10,
  paper: 5,
  can: 15,
};

export function EcoSnakeGame() {
  const { user } = useUser();
  const firestore = useFirestore();

  const [snake, setSnake] = useState<Snake>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Food>({ ...getRandomCoordinate(), type: getRandomWasteType() });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tileSize, setTileSize] = useState(INITIAL_TILE_SIZE);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameBoardRef = useRef<HTMLDivElement>(null);
  
  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc(userProfileRef);

  const highScore = userProfile?.highestScore ?? 0;


  const updateTileSize = useCallback(() => {
    if (gameBoardRef.current) {
        const { width, height } = gameBoardRef.current.getBoundingClientRect();
        const minDim = Math.min(width, height);
        setTileSize(Math.floor(minDim / GRID_SIZE));
    }
  }, []);

  const handleFullScreenChange = useCallback(() => {
    setIsFullScreen(!!document.fullscreenElement);
    setTimeout(updateTileSize, 100);
  }, [updateTileSize]);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    window.addEventListener('resize', updateTileSize);
    
    // Initial size calculation
    updateTileSize();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      window.removeEventListener('resize', updateTileSize);
    };
  }, [handleFullScreenChange, updateTileSize]);

  useEffect(() => {
    updateTileSize();
  }, [isFullScreen, updateTileSize]);

  const toggleFullScreen = () => {
    if (!gameContainerRef.current) return;
    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    let newFoodPosition;
    do {
      newFoodPosition = getRandomCoordinate();
    } while (newFoodPosition.x === 10 && newFoodPosition.y === 10);

    setFood({ ...newFoodPosition, type: getRandomWasteType() });
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(true);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isGameStarted) return;
    e.preventDefault();
    switch (e.key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'arrowdown':
      case 's':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'arrowleft':
      case 'a':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'arrowright':
      case 'd':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [direction, isGameStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const gameTick = useCallback(() => {
    if (isGameOver || !isGameStarted) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setIsGameOver(true);
          return prevSnake;
        }
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prevScore => prevScore + wastePoints[food.type]);
        let newFoodPosition;
        do {
          newFoodPosition = getRandomCoordinate();
        } while (newSnake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
        setFood({ ...newFoodPosition, type: getRandomWasteType() });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isGameStarted]);

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      gameLoopRef.current = setInterval(gameTick, GAME_SPEED);
      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameTick, isGameStarted, isGameOver]);

  useEffect(() => {
    if (isGameOver && userProfileRef && user) {
        const userUpdateData = { lastRunScore: score, lastRunTimestamp: new Date() };
        if (score > highScore) {
            Object.assign(userUpdateData, { highestScore: score });
            const leaderboardRef = doc(firestore, 'leaderboard', user.uid);
            const leaderboardData = {
                name: userProfile?.name || user.displayName || 'Anonymous',
                photoURL: userProfile?.photoURL || user.photoURL || '',
                highestScore: score,
            };
            setDocumentNonBlocking(leaderboardRef, leaderboardData, { merge: true });
        }
        updateDocumentNonBlocking(userProfileRef, userUpdateData);
        if (gameLoopRef.current) {
            clearInterval(gameLoopRef.current);
        }
    }
  }, [isGameOver, score, highScore, userProfileRef, user, firestore, userProfile]);

  const renderGrid = () => {
    const tiles = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(seg => seg.x === x && seg.y === y);
        const isFood = food.x === x && food.y === y;
        const isSnakeHead = snake[0].x === x && snake[0].y === y;

        tiles.push(
          <div
            key={`${x}-${y}`}
            className="rounded-sm"
            style={{
              width: tileSize,
              height: tileSize,
              backgroundColor: isSnakeHead ? '#2E7D32' : isSnake ? '#4CAF50' : 'hsl(var(--muted))',
              position: 'relative'
            }}
          >
            {isFood && wasteImages[food.type] && (
              <Image src={wasteImages[food.type]!.imageUrl} alt={food.type} layout="fill" objectFit="contain" className="p-1" />
            )}
          </div>
        );
      }
    }
    return tiles;
  };
  
  const boardSize = GRID_SIZE * tileSize;

  return (
    <div ref={gameContainerRef} className="flex flex-col items-center justify-center w-full bg-background transition-all duration-300 p-4 data-[fullscreen=true]:h-screen data-[fullscreen=true]:p-8" data-fullscreen={isFullScreen}>
      <div className="flex justify-between w-full mb-4 p-4 rounded-lg bg-muted" style={{maxWidth: boardSize}}>
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-primary">{score}</p>
        </div>
        <div className="text-center">
            <p className="font-headline text-2xl text-primary">EcoSnake</p>
        </div>
        <div className="text-center">
            <p className="text-sm text-muted-foreground">High Score</p>
            <p className="text-2xl font-bold text-primary">{highScore}</p>
        </div>
        <Button variant="outline" size="icon" onClick={toggleFullScreen} className="self-center">
            {isFullScreen ? <Minimize /> : <Maximize />}
            <span className="sr-only">Toggle Fullscreen</span>
        </Button>
      </div>
      <div
        ref={gameBoardRef}
        className="relative bg-background-alt border-4 border-muted-foreground/20 rounded-lg overflow-hidden transition-all duration-300 w-full h-auto aspect-square"
        style={{
          maxWidth: 'min(100vw - 2rem, 100vh - 10rem)',
          maxHeight: 'min(100vw - 2rem, 100vh - 10rem)',
        }}
      >
          <div
            className="absolute top-1/2 left-1/2"
            style={{
                transform: 'translate(-50%, -50%)',
                width: boardSize,
                height: boardSize,
                display: 'grid',
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {!isGameStarted && (
            <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center text-white col-span-full row-span-full">
                <h3 className="font-headline text-2xl mb-4">Welcome to EcoSnake!</h3>
                <p className="mb-6 text-center max-w-xs">Use your arrow keys to move the snake and collect the waste items.</p>
                <Button onClick={resetGame} size="lg">
                <Play className="mr-2" /> Start Game
                </Button>
            </div>
            )}
            {isGameOver && (
            <div className="absolute inset-0 bg-black/70 z-10 flex flex-col items-center justify-center text-white p-4 col-span-full row-span-full">
                <h3 className="font-headline text-3xl mb-2">Game Over</h3>
                <p className="text-lg mb-4">Your final score is {score}</p>
                {score > 0 && score > highScore && (
                    <div className="flex items-center text-amber-400 mb-6">
                        <Award className="mr-2" />
                        <span>New High Score!</span>
                    </div>
                )}
                <Button onClick={resetGame}>
                <RotateCw className="mr-2" /> Play Again
                </Button>
            </div>
            )}
            {renderGrid()}
          </div>
      </div>
       <div className="w-full mt-4 text-center text-sm text-muted-foreground" style={{maxWidth: boardSize}}>
        Use the <span className="font-bold">Arrow Keys</span> or <span className="font-bold">W, A, S, D</span> on your keyboard to control the snake.
      </div>
    </div>
  );
}

    