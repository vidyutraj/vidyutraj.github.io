import { useState, useEffect, useRef } from 'react';
import { MousePointerClick, Timer, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ClickCounter = () => {
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isActive, setIsActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load best score from localStorage on mount
  useEffect(() => {
    const savedBest = localStorage.getItem('portfolioClickSpeedBest');
    if (savedBest) {
      setBestScore(parseInt(savedBest, 10));
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsActive(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  // Handle game end and save best score
  useEffect(() => {
    if (!isActive && gameStarted && timeLeft === 0) {
      if (clicks > bestScore) {
        setBestScore(clicks);
        localStorage.setItem('portfolioClickSpeedBest', clicks.toString());
      }
    }
  }, [isActive, gameStarted, timeLeft, clicks, bestScore]);

  const startGame = () => {
    setClicks(0);
    setTimeLeft(5);
    setIsActive(true);
    setGameStarted(true);
  };

  const handleClick = () => {
    if (isActive && timeLeft > 0) {
      setClicks((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setClicks(0);
    setTimeLeft(5);
    setIsActive(false);
    setGameStarted(false);
  };

  const clicksPerSecond = timeLeft > 0 && gameStarted ? (clicks / (5 - timeLeft)).toFixed(1) : (clicks / 5).toFixed(1);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-full w-full flex flex-col p-10 rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
            <MousePointerClick className="w-5 h-5 text-primary" />
            Click Speed Test
          </h3>
          <p className="text-sm text-muted-foreground">
            How fast can you click in 5 seconds? (I promise this is relevant to cybersecurity... somehow)
          </p>
        </div>

        {/* Timer Display */}
        {gameStarted && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <Timer className={`w-5 h-5 ${timeLeft <= 2 ? 'text-red-500' : 'text-primary'}`} />
            <span className={`text-4xl font-mono font-bold ${timeLeft <= 2 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
              {timeLeft}
            </span>
            <span className="text-sm text-muted-foreground">sec</span>
          </div>
        )}

        {/* Click Area */}
        <button
          onClick={handleClick}
          disabled={!isActive}
          className={`
            w-full h-48 rounded-xl
            bg-gradient-to-br ${isActive ? 'from-primary/30 via-primary/20 to-primary/10' : 'from-secondary/50 via-secondary/30 to-secondary/20'}
            border-2 ${isActive ? 'border-primary/50 hover:border-primary shadow-lg shadow-primary/20' : 'border-border/30'}
            transition-all duration-200
            ${isActive ? 'hover:scale-[1.01] active:scale-[0.99] cursor-pointer' : 'cursor-not-allowed'}
            flex flex-col items-center justify-center
            mb-6
            relative overflow-hidden
          `}
        >
          
          <span className="text-6xl font-mono font-bold text-primary mb-3 relative z-10">
            {clicks}
          </span>
          <span className={`text-sm font-medium relative z-10 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
            {isActive ? 'Click as fast as you can!' : gameStarted ? 'Time\'s up!' : 'Click to start'}
          </span>
        </button>

        {/* Stats */}
        {gameStarted && (
          <div className="space-y-3 mb-6 p-4 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Speed:</span>
              <span className="text-sm font-mono font-bold text-foreground">{clicksPerSecond} clicks/sec</span>
            </div>
            {bestScore > 0 && (
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Best:
                </span>
                <span className="text-sm font-mono font-bold text-yellow-500">{bestScore} clicks</span>
              </div>
            )}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-2">
          {!gameStarted ? (
            <Button onClick={startGame} variant="hero" className="w-full" size="lg">
              Start Game
            </Button>
          ) : (
            <Button onClick={resetGame} variant="outline" className="w-full" size="lg">
              Play Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

