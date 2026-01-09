"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Zap,
  Trophy,
  RotateCcw,
  AlertCircle,
  Clock,
  MousePointer2,
  Brain,
  CheckCircle2,
  Flame,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type GameMode = "idle" | "tap" | "color" | "gameOver";
type ThemeMode = "night" | "morning";

interface SleepGameSectionProps {
  themeMode: ThemeMode;
}

const COLORS = [
  {
    name: "NEON PINK",
    class: "bg-fuchsia-500 shadow-fuchsia-500/50",
    hex: "#d946ef",
  },
  {
    name: "CYAN BLAST",
    class: "bg-cyan-400 shadow-cyan-400/50",
    hex: "#22d3ee",
  },
  {
    name: "LIME SHOCK",
    class: "bg-lime-400 shadow-lime-400/50",
    hex: "#a3e635",
  },
  {
    name: "AMBER GLOW",
    class: "bg-amber-400 shadow-amber-400/50",
    hex: "#fbbf24",
  },
];

const MOTIVATIONAL_MESSAGES = [
  "EYES OPEN. FOCUS ON.",
  "ADRENALINE SURGE INITIALIZED.",
  "SLEEP IS FOR THE WEAK. STUDY IS FOR THE WISE.",
  "COGNITIVE LOAD BALANCED.",
  "STAY VIGILANT, OWL.",
];

export function SleepGameSection({ themeMode }: SleepGameSectionProps) {
  const [gameMode, setGameMode] = useState<GameMode>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [isWrong, setIsWrong] = useState(false);

  // Mode 1: Tap the Alert Icon
  const [activeIcon, setActiveIcon] = useState<{
    x: number;
    y: number;
    id: number;
  } | null>(null);

  // Mode 2: Color Match Boost
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [displayColor, setDisplayColor] = useState(COLORS[0]);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("owl-sleep-high-score");
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  const startGame = (mode: "tap" | "color") => {
    setScore(0);
    setStreak(0);
    setTimeLeft(30);
    setGameMode(mode);
    setIsWrong(false);

    if (mode === "tap") {
      spawnIcon();
    } else {
      generateColorMatch();
    }

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);

    setGameMode("gameOver");
    setHighScore((prev) => {
      const newScore = Math.max(prev, score);
      localStorage.setItem("owl-sleep-high-score", newScore.toString());
      return newScore;
    });

    toast.success("Round Complete!", {
      description:
        MOTIVATIONAL_MESSAGES[
          Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
        ],
    });
  };

  // Mode 1 Logic: Tap Icon
  const spawnIcon = useCallback(() => {
    const x = Math.random() * 80 + 10; // 10% to 90%
    const y = Math.random() * 70 + 15; // 15% to 85%
    setActiveIcon({ x, y, id: Date.now() });

    // Auto-fail if not tapped quickly as speed increases
    const delay = Math.max(400, 1500 - score * 20);
    if (gameIntervalRef.current) clearTimeout(gameIntervalRef.current);
    gameIntervalRef.current = setTimeout(() => {
      handleMiss();
    }, delay);
  }, [score]);

  const handleIconTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScore((prev) => prev + 10 + Math.floor(streak / 5));
    setStreak((prev) => prev + 1);
    spawnIcon();
  };

  const handleMiss = () => {
    setIsWrong(true);
    setTimeout(() => setIsWrong(false), 200);
    setStreak(0);
    setScore((prev) => Math.max(0, prev - 5));
    spawnIcon();
  };

  // Mode 2 Logic: Color Match
  const generateColorMatch = useCallback(() => {
    const target = COLORS[Math.floor(Math.random() * COLORS.length)];
    const display =
      Math.random() > 0.4
        ? target
        : COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(target);
    setDisplayColor(display);
  }, []);

  const handleColorChoice = (choice: (typeof COLORS)[0]) => {
    if (choice.name === targetColor.name) {
      setScore((prev) => prev + 15 + Math.floor(streak / 3));
      setStreak((prev) => prev + 1);
      generateColorMatch();
    } else {
      setIsWrong(true);
      setTimeout(() => setIsWrong(false), 300);
      setStreak(0);
      setScore((prev) => Math.max(0, prev - 10));
    }
  };

  return (
    <div
      className={cn(
        "flex-1 flex flex-col min-h-0 relative overflow-y-auto p-6 ",
        themeMode === "night" ? "text-white" : "text-slate-900"
      )}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            "absolute top-1/4 left-1/4 w-96 h-96 blur-[150px] rounded-full opacity-20 animate-pulse",
            themeMode === "night" ? "bg-primary" : "bg-violet-400"
          )}
        />
        <div
          className={cn(
            "absolute bottom-1/4 right-1/4 w-96 h-96 blur-[150px] rounded-full opacity-20 animate-pulse delay-700",
            themeMode === "night" ? "bg-fuchsia-500" : "bg-sky-400"
          )}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 mt-10flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8  ">
        <div>
          <h1 className="text-3xl md:text-4xl mt-15 mb-7 font-display font-black tracking-wider uppercase ml-15">
            Open Your Eyes
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "px-6 py-3 rounded-2xl glass flex flex-col items-center min-w-[100px]",
              themeMode === "morning" && "bg-slate-100 border-slate-200"
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
              High Score
            </span>
            <span className="text-xl font-display font-black tracking-tighter">
              {highScore}
            </span>
          </div>
          <div
            className={cn(
              "px-6 py-3 rounded-2xl glass flex flex-col items-center min-w-[100px] border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.2)]",
              themeMode === "morning" && "bg-white border-primary/20"
            )}
          >
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">
              Score
            </span>
            <span className="text-xl font-display font-black tracking-tighter text-primary">
              {score}
            </span>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div
        className={cn(
          "flex-1 min-h-[600px] sm:min-h-[680px] md:min-h-[760px] lg:min-h-[820px]",
          "relative glass rounded-[2.5rem] border-2 flex flex-col items-center justify-center overflow-hidden transition-all duration-300",
          themeMode === "night"
            ? "bg-black/40 border-white/5"
            : "bg-slate-50/50 border-slate-200",
          isWrong &&
            "border-red-500/50 bg-red-500/10 scale-[0.99] shake-animation"
        )}
      >
        {gameMode === "idle" && (
          <div className="flex flex-col items-center gap-8 p-8 text-center max-w-lg">
            <div>
              <h2 className="text-3xl font-display font-black tracking-tighter uppercase mb-4">
                Choose Your game
              </h2>
              <p className="text-sm font-bold opacity-60 uppercase leading-relaxed">
                select a small game to recalibrate your focus and eliminate your
                sleep.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <button
                onClick={() => startGame("tap")}
                className="group relative h-24 rounded-2xl bg-white/5 border border-black hover:border-primary/50 transition-all flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                <MousePointer2 className="w-6 h-6 text-primary mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Neural Reflex
                </span>
              </button>
              <button
                onClick={() => startGame("color")}
                className="group relative h-24 rounded-2xl bg-white/5 border border-black hover:border-violet-500/50 transition-all flex flex-col items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors" />
                <Brain className="w-6 h-6 text-violet-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-black uppercase tracking-widest">
                  Color Match
                </span>
              </button>
            </div>
          </div>
        )}

        {(gameMode === "tap" || gameMode === "color") && (
          <>
            {/* Timer Overlay */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2 rounded-full glass border-primary/20">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-lg font-display font-black tracking-tighter w-8">
                {timeLeft}s
              </span>
            </div>

            {/* Streak Counter */}
            <AnimatePresence>
              {streak > 2 && (
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-2"
                >
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span className="text-2xl font-display font-black italic text-orange-500 tracking-tighter">
                    {streak} STREAK
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mode 1: Tap Area */}
            {gameMode === "tap" && (
              <div
                className="absolute inset-0 cursor-crosshair"
                onClick={handleMiss}
              >
                {activeIcon && (
                  <motion.button
                    key={activeIcon.id}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleIconTap}
                    style={{
                      left: `${activeIcon.x}%`,
                      top: `${activeIcon.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.6)] border-4 border-white group"
                  >
                    <AlertCircle className="w-10 h-10 text-white animate-bounce" />
                    <div className="absolute inset-0 rounded-full animate-ping bg-white/40" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Mode 2: Color Match Area */}
            {gameMode === "color" && (
              <div className="flex flex-col items-center mt-18 gap-12 p-8 w-full max-w-md">
                <div className="text-center">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-4">
                    Match Target
                  </h3>
                  <div
                    className={cn(
                      "w-32 h-32 rounded-[2rem] border-4 border-white/20 flex items-center justify-center transition-all duration-300",
                      targetColor.class
                    )}
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleColorChoice(color)}
                      className={cn(
                        "h-24 rounded-2xl transition-all active:scale-95 border-2 border-transparent hover:border-white shadow-xl flex items-center justify-center",
                        color.class
                      )}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {gameMode === "gameOver" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 p-8 text-center"
          >
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-2xl relative">
              <Trophy className="w-16 h-16 text-white" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-white/20 rounded-[2.5rem]"
              />
            </div>

            <div>
              <h2 className="text-4xl font-display font-black tracking-tighter uppercase italic">
                Protocol <span className="text-primary">Complete</span>
              </h2>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Score
                  </span>
                  <span className="text-3xl font-display font-black text-primary">
                    {score}
                  </span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Best
                  </span>
                  <span className="text-3xl font-display font-black">
                    {highScore}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setGameMode("idle")}
              className="px-10 py-5 rounded-2xl bg-white text-black font-display font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3"
            >
              <RotateCcw className="w-4 h-4" />
              New Training
            </button>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        .glass {
          background: ${themeMode === "night"
            ? "rgba(255, 255, 255, 0.03)"
            : "rgba(0, 0, 0, 0.03)"};
          backdrop-filter: blur(20px);
          border: 1px solid
            ${themeMode === "night"
              ? "rgba(255, 255, 255, 0.05)"
              : "rgba(0, 0, 0, 0.05)"};
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .shake-animation {
          animation: shake 0.1s ease-in-out 2;
        }

        .tracking-tightest {
          letter-spacing: -0.05em;
        }
      `}</style>
    </div>
  );
}
