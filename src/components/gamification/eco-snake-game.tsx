
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Award, Play, RotateCw, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [snake, setSnake] = useState<Snake>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Food>({ ...getRandomCoordinate(), type: getRandomWasteType() });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [tileSize, setTileSize] = useState(INITIAL_TILE_SIZE);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameBoardRef = useRef<HTMLDivElement>(null);


  const updateTileSize = useCallback(() => {
    if (gameBoardRef.current) {
        const { width, height } = gameBoardRef.current.getBoundingClientRect();
        const minDim = Math.min(width, height);
        setTileSize(Math.floor(minDim / GRID_SIZE));
    }
  }, []);

  const handleFullScreenChange = useCallback(() => {
    setIsFullScreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    window.addEventListener('resize', updateTileSize);
    
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
    setFood({ ...getRandomCoordinate(), type: getRandomWasteType() });
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(true);
  }, []);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('ecoSnakeHighScore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore, 10));
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isGameStarted) return;
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
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
    if (isGameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('ecoSnakeHighScore', score.toString());
      }
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
  }, [isGameOver, score, highScore]);

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

  return (
    <div ref={gameContainerRef} className="flex flex-col items-center w-full bg-background transition-all duration-300 p-4 rounded-lg data-[fullscreen=true]:p-8 data-[fullscreen=true]:h-screen data-[fullscreen=true]:justify-center" data-fullscreen={isFullScreen}>
      <div className="flex justify-between w-full max-w-lg mb-4 p-4 rounded-lg bg-muted">
        <div className="text-center">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold text-primary">{score}</p>
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
        className="relative bg-background-alt border-4 border-muted-foreground/20 rounded-lg overflow-hidden transition-all duration-300"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${tileSize}px)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, ${tileSize}px)`,
          width: GRID_SIZE * tileSize,
          height: GRID_SIZE * tileSize,
        }}
      >
        {!isGameStarted && (
          <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center text-white">
            <h3 className="font-headline text-2xl mb-4">Welcome to EcoSnake!</h3>
            <p className="mb-6 text-center max-w-xs">Use your arrow keys to move the snake and collect the waste items.</p>
            <Button onClick={() => setIsGameStarted(true)} size="lg">
              <Play className="mr-2" /> Start Game
            </Button>
          </div>
        )}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/70 z-10 flex flex-col items-center justify-center text-white p-4">
            <h3 className="font-headline text-3xl mb-2">Game Over</h3>
            <p className="text-lg mb-4">Your final score is {score}</p>
             {score > 0 && score === highScore && (
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
       <div className="w-full max-w-lg mt-4 text-center text-sm text-muted-foreground">
        Use the <span className="font-bold">Arrow Keys</span> on your keyboard to control the snake.
      </div>
    </div>
  );
}
