"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Droplets, 
  Coffee, 
  Utensils, 
  Tv, 
    Zap,
    Sparkles,
    RefreshCw,
    Waves,
    LifeBuoy
  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ANIME_SUGGESTIONS = [
  { title: "Blue Period", type: "Art/Passion" },
  { title: "Dr. Stone", type: "Science/Adventure" },
  { title: "Haikyuu!!", type: "Energy/Sports" },
  { title: "Keep Your Hands Off Eizouken!", type: "Creative" },
  { title: "Silver Spoon", type: "Relaxing" },
  { title: "Spy x Family", type: "Wholesome" }
];

const THOUGHTS = [
  "hey did u drank water? 💧",
  "u need cofee? ⚡",
  "take a break bro... 📺",
  "stay sharp owl! 🦉",
  "brain fuel low? 🧠",
  "drink up! 🥤"
];

const STATIONS = {
  water: { x: 20, y: 30, icon: Droplets, label: "Water", color: "text-blue-400", bg: "bg-blue-500/10" },
  coffee: { x: 80, y: 30, icon: Coffee, label: "Coffee", color: "text-violet-500", bg: "bg-violet-500/10" },
  snack: { x: 50, y: 70, icon: Utensils, label: "Snacks", color: "text-fuchsia-500", bg: "bg-fuchsia-500/10" }
};

function NormalOwl({ isWalking, facing, themeMode }: { isWalking: boolean, facing: number, themeMode: "night" | "morning" }) {
  const accentColor = themeMode === "night" ? "#FF9800" : "#8B5CF6"; // Purple for morning
  const eyeColor = themeMode === "night" ? "#FFEB3B" : "#A78BFF"; // Softer purple/yellow for eyes

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <div className="absolute bottom-4 w-full flex justify-center gap-10">
        {[0, 0.3].map((delay, i) => (
          <motion.div
            key={i}
            animate={isWalking ? {
              y: [0, -15, 0],
              x: [0, i === 0 ? 10 : -10, 0],
              rotate: [0, i === 0 ? 15 : -15, 0],
            } : { y: 0, x: 0, rotate: 0 }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay }}
            className="w-4 h-8 rounded-full origin-top transition-colors duration-500"
            style={{ backgroundColor: accentColor }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          </motion.div>
        ))}
      </div>

      <motion.div 
        animate={{
          scaleX: facing,
          y: isWalking ? [0, -10, 0] : [0, -4, 0],
          rotate: isWalking ? [0, -5, 5, 0] : 0,
        }}
        transition={{ 
          duration: isWalking ? 0.6 : 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-32 h-36 z-10"
      >
        <svg viewBox="0 0 100 110" className="absolute inset-0 w-full h-full">
          <ellipse cx="50" cy="55" rx="45" ry="50" fill={themeMode === "night" ? "#795548" : "#5B21B6"} />
          <path d="M 10 40 Q -5 60 15 90 L 30 85 Q 15 60 25 40 Z" fill={themeMode === "night" ? "#5D4037" : "#4C1D95"} />
          <path d="M 90 40 Q 105 60 85 90 L 70 85 Q 85 60 75 40 Z" fill={themeMode === "night" ? "#5D4037" : "#4C1D95"} />
          <path 
            d="M 50 25 Q 75 25 75 55 Q 75 85 50 95 Q 25 85 25 55 Q 25 25 50 25" 
            fill={themeMode === "night" ? "#D7CCC8" : "#DDD6FE"} 
          />
          <path d="M 30 25 L 15 5 L 45 20 Z" fill={themeMode === "night" ? "#5D4037" : "#4C1D95"} />
          <path d="M 70 25 L 85 5 L 55 20 Z" fill={themeMode === "night" ? "#5D4037" : "#4C1D95"} />
          <circle cx="38" cy="50" r="14" fill={eyeColor} stroke="#3E2723" strokeWidth="2" />
          <circle cx="62" cy="50" r="14" fill={eyeColor} stroke="#3E2723" strokeWidth="2" />
          <motion.circle 
            cx="38" cy="50" r="8" fill="black"
            animate={{ scaleY: [1, 1, 0, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.47, 0.49, 1] }}
          />
          <motion.circle 
            cx="62" cy="50" r="8" fill="black"
            animate={{ scaleY: [1, 1, 0, 1, 1] }}
            transition={{ duration: 4, repeat: Infinity, times: [0, 0.45, 0.47, 0.49, 1] }}
          />
          <circle cx="41" cy="47" r="3" fill="white" opacity="0.6" />
          <circle cx="65" cy="47" r="3" fill="white" opacity="0.6" />
          <path d="M 45 62 L 55 62 L 50 78 Z" fill={accentColor} />
        </svg>
      </motion.div>
    </div>
  );
}

function ActionButton({ onClick, icon: Icon, label, color, themeMode }: any) {
    const colors: any = {
      blue: themeMode === "night" 
        ? "bg-white/10 border-white/10 hover:bg-white/20 text-white" 
        : "bg-blue-50/50 border-blue-100/50 hover:bg-blue-100 text-blue-900 shadow-sm",
      orange: themeMode === "night" 
        ? "bg-white/10 border-white/10 hover:bg-white/20 text-white"
        : "bg-violet-50/50 border-violet-100/50 hover:bg-violet-100 text-violet-900 shadow-sm",
      green: themeMode === "night" 
        ? "bg-white/10 border-white/10 hover:bg-white/20 text-white"
        : "bg-green-50/50 border-green-100/50 hover:bg-green-100 text-green-900 shadow-sm",
      violet: themeMode === "night" 
        ? "bg-white/10 border-white/10 hover:bg-white/20 text-white"
        : "bg-violet-50/50 border-violet-100/50 hover:bg-violet-100 text-violet-900 shadow-sm"
    };

    return (
      <Button 
        onClick={onClick}
        className={cn(
          "h-16 border-2 font-black rounded-2xl justify-start gap-4 transition-all duration-300 group px-6",
          colors[color]
        )}
      >
        <div className={cn(
          "p-2.5 rounded-xl group-hover:scale-110 transition-transform",
          themeMode === "night" ? "bg-background/50" : "bg-white shadow-sm"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="tracking-tight text-base">{label}</span>
      </Button>
    );
  }
  
  function StatItem({ label, value, color, max, themeMode }: { label: string, value: number, color: string, max: number, themeMode: "night" | "morning" }) {
    const percentage = Math.min((value / max) * 100, 100);
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest px-1">
          <span className="text-muted-foreground">{label}</span>
          <span className={themeMode === "night" ? "text-white" : "text-slate-900"}>{value}/{max}</span>
        </div>
        <div className={cn(
          "h-4 w-full rounded-full  p-[2px] border",
          themeMode === "night" ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-200 shadow-inner"
        )}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className={`h-full ${color} rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)] relative transition-all duration-500`}
          >
            {percentage > 0 && (
              <motion.div 
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/20 w-1/3 skew-x-12"
              />
            )}
          </motion.div>
        </div>
      </div>
    );
  }

      export function VitalitySection({ themeMode = "night", setActiveSection }: { themeMode?: "night" | "morning", setActiveSection?: (section: any) => void }) {
        const [toyPos, setToyPos] = useState({ x: 50, y: 50 });
        const [currentThought, setCurrentThought] = useState<string | null>(null);
        const [isWalking, setIsWalking] = useState(false);
        const [stats, setStats] = useState({ water: 0, coffee: 0, snacks: 0 });
        const [facing, setFacing] = useState(1);
        const [mounted, setMounted] = useState(false);
        const [isDataLoaded, setIsDataLoaded] = useState(false);

        useEffect(() => {
          setMounted(true);
          const savedStats = localStorage.getItem("owl-vitality-stats");
          if (savedStats) {
            try {
              setStats(JSON.parse(savedStats));
            } catch (e) {
              console.error("Failed to parse vitality stats");
            }
          }
          setIsDataLoaded(true);
        }, []);

        useEffect(() => {
          if (isDataLoaded) {
            localStorage.setItem("owl-vitality-stats", JSON.stringify(stats));
          }
        }, [stats, isDataLoaded]);




  const triggerThought = useCallback((msg?: string) => {
    setCurrentThought(msg || THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)]);
    setTimeout(() => setCurrentThought(null), 4000);
  }, []);

  const walkTo = useCallback((x: number, y: number) => {
    setFacing(x > toyPos.x ? 1 : -1);
    setIsWalking(true);
    setToyPos({ x, y });
    setTimeout(() => setIsWalking(false), 2000);
  }, [toyPos]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isWalking && Math.random() > 0.7) {
        const stationKeys = Object.keys(STATIONS);
        const randomStation = STATIONS[stationKeys[Math.floor(Math.random() * stationKeys.length)] as keyof typeof STATIONS];
        walkTo(randomStation.x, randomStation.y);
        triggerThought();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [isWalking, walkTo, triggerThought]);

  const handleAction = (type: 'water' | 'coffee' | 'snack') => {
    const station = STATIONS[type];
    walkTo(station.x, station.y);
    setStats(prev => ({ ...prev, [type]: prev[type as keyof typeof prev] + 1 }));
    
    setTimeout(() => {
      if (type === 'water') {
        triggerThought("Drinking! 💧");
        toast.success("Hydration synced.");
      } else if (type === 'coffee') {
        triggerThought("Lovable!");
        toast.success("Caffeine boost active.");
      } else {
        triggerThought("yummy snack! 🍎");
        toast.success("Nutrition optimized.");
      }
    }, 2000);
  };

  const getRandomAnime = () => {
    const anime = ANIME_SUGGESTIONS[Math.floor(Math.random() * ANIME_SUGGESTIONS.length)];
    triggerThought(`watch ${anime.title}! 📺`);
  };

 
   return (
<main className={cn(
  "w-full max-w-6xl mx-auto",
  "min-h-screen",              // 🔥 FORCE HEIGHT
  "p-4 pt-16 md:pt-20 pb-32",
  "flex flex-col items-center gap-8 md:gap-12",
)}>


      <header className="text-center space-y-4 pt-9 md:pt-24">
        <h1 className={cn(
          "text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter drop-shadow-2xl transition-colors duration-500",
          themeMode === "night" ? "text-white" : "text-slate-900"
        )}>
   Let's have a break 😂 
        </h1>
        <div className={cn(
          "flex items-center justify-center gap-2 font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] transition-colors duration-500",
          themeMode === "night" ? "text-white/60" : "text-slate-500"
        )}>
          <Waves className="w-3 h-3 animate-pulse" />
        
“Night study, sleep betrayed. ”
          <Waves className="w-3 h-3 animate-pulse" />
        </div>
      </header>

     <div className="w-full flex flex-col gap-6 md:gap-10 items-center">

          <Card className={cn(
            "w-full relative  flex flex-col items-center justify-center min-h-[400px] md:min-h-[550px] shadow-2xl transition-all duration-500",
            themeMode === "night" ? "glass border-white/5" : "bg-white/5 border-white/10 shadow-none"
          )}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className={cn(
                "absolute top-0 left-0 w-full h-full",
                themeMode === "night" 
                  ? "bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.15),transparent_70%)]" 
                  : "bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]"
              )} />
              <div className={cn(
                "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]",
                themeMode === "morning" && "opacity-20"
              )} />
            </div>

            <div className={cn(
              "absolute left-[5%] top-[10%] w-[35%] h-[35%] blur-[80px] rounded-full animate-pulse transition-colors duration-1000",
              themeMode === "night" ? "bg-blue-500/10" : "bg-blue-200/20"
            )} />
            <div className={cn(
              "absolute right-[5%] top-[10%] w-[35%] h-[35%] blur-[80px] rounded-full animate-pulse delay-700 transition-colors duration-1000",
              themeMode === "night" ? "bg-primary/5" : "bg-violet-200/20"
            )} />


          <div className="relative w-full h-full max-w-3xl flex items-center justify-center">
            {Object.entries(STATIONS).map(([key, station]) => (
              <motion.div
                key={key}
                initial={false}
                animate={{
                  scale: isWalking && Math.abs(toyPos.x - station.x) < 5 && Math.abs(toyPos.y - station.y) < 5 ? 1.2 : 1,
                  opacity: isWalking && Math.abs(toyPos.x - station.x) < 5 && Math.abs(toyPos.y - station.y) < 5 ? 1 : 0.6
                }}
                className={cn(
                  "absolute flex flex-col items-center gap-1 md:gap-2 -translate-x-1/2 -translate-y-1/2 p-3 md:p-5 rounded-2xl md:rounded-[2.5rem] backdrop-blur-md border shadow-xl transition-all duration-500",
                  station.bg,
                  themeMode === "night" ? "border-white/10" : "border-slate-100"
                )}
                style={{ left: `${station.x}%`, top: `${station.y}%` }}
              >
                <div className="relative">
                  <station.icon className={`w-6 h-6 md:w-10 md:h-10 ${station.color}`} />
                  {key === 'water' && (
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-blue-400/20 blur-md"
                    />
                  )}
                </div>
                <span className={cn(
                  "text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-70",
                  themeMode === "night" ? "text-white" : "text-slate-600"
                )}>{station.label}</span>
              </motion.div>
            ))}

            <motion.div
              animate={{ 
                left: `${toyPos.x}%`, 
                top: `${toyPos.y}%`,
              }}
              transition={{ 
                duration: 2, 
                ease: "easeInOut"
              }}
              className="absolute -ml-10 -mt-10 md:-ml-16 md:-mt-16 cursor-pointer z-50 group scale-[0.6] md:scale-100"
              onClick={() => triggerThought()}
            >
              <div className="relative">
                <AnimatePresence>
                  {currentThought && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.5, x: "-50%" }}
                      animate={{ opacity: 1, y: -105, scale: 1.2, x: "-50%" }}
                      exit={{ opacity: 0, scale: 0.5, x: "-50%" }}
                        className={cn(
                          "absolute left-1/2 whitespace-nowrap px-6 py-4 rounded-[2rem] font-black text-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[100] border-4",
                          themeMode === "night" 
                            ? "bg-white text-black border-primary" 
                            : "bg-slate-900 text-white border-violet-500 shadow-slate-900/40"
                        )}
                      >
                        {currentThought}
                        <div className={cn(
                          "absolute bottom-[-12px] left-1/2 -translate-x-1/2 w-6 h-6 border-r-4 border-b-4 rotate-45",
                          themeMode === "night" 
                            ? "bg-white border-primary" 
                            : "bg-slate-900 border-violet-500"
                        )} />
                      </motion.div>
                    )}
                  </AnimatePresence>
  
                    <div className="relative">
                      <NormalOwl isWalking={isWalking} facing={facing} themeMode={themeMode} />
                      {!isWalking && (
                        <motion.div 
                          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={cn(
                            "absolute inset-0 rounded-full border-4 pointer-events-none",
                            themeMode === "night" ? "border-primary/30" : "border-violet-500/30"
                          )} 
                        />
                      )}
                    </div>


                <motion.div 
                  animate={{ 
                    scale: isWalking ? [1, 0.85, 1] : 1,
                    opacity: isWalking ? [0.5, 0.3, 0.5] : 0.4
                  }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/60 blur-xl rounded-full" 
                />
              </div>
            </motion.div>
          </div>
        </Card>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Card className={cn(
                "p-6 md:p-10 space-y-8 shadow-2xl transition-all duration-500 rounded-[2.5rem]",
                themeMode === "night" ? "glass border-white/5" : "bg-white border-slate-200"
              )}>
                <div className="flex items-center justify-between">
                  <h3 className={cn(
                    "text-xs md:text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3",
                    themeMode === "night" ? "text-white" : "text-slate-900"
                  )}>
                    <Zap className="w-5 h-5 text-primary" />
                    Quick Actions
                  </h3>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton 
                onClick={() => handleAction('water')}
                icon={Droplets}
                label="Hydrate"
                color="blue"
                themeMode={themeMode}
              />
              <ActionButton 
                onClick={() => handleAction('coffee')}
                icon={Coffee}
                label="Caffeine"
                color="orange"
                themeMode={themeMode}
              />
              <ActionButton 
                onClick={() => handleAction('snack')}
                icon={Utensils}
                label="Fuel Up"
                color="green"
                themeMode={themeMode}
              />
            </div>
          </Card>

            <Card className={cn(
              "p-6 md:p-10 space-y-8 shadow-2xl transition-all duration-500 rounded-[2.5rem]",
              themeMode === "night" ? "glass border-white/5" : "bg-white border-slate-200"
            )}>
              <div className="flex items-center justify-between">
                <h3 className={cn(
                  "text-xs md:text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3",
                  themeMode === "night" ? "text-white" : "text-slate-900"
                )}>
                  <Sparkles className="w-5 h-5 text-primary" />
                  Bio-Stats
                </h3>
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-1 h-1 rounded-full bg-primary opacity-40" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <StatItem label="Fluid Balance" value={stats.water} color="bg-blue-400" max={10} themeMode={themeMode} />
                <StatItem label="Stimulation" value={stats.coffee} color="bg-violet-500" max={5} themeMode={themeMode} />
                <StatItem label="Nutrition" value={stats.snacks} color="bg-fuchsia-500" max={8} themeMode={themeMode} />
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                
                <Button 
                  variant="ghost" 
                  onClick={() => setStats({ water: 0, coffee: 0, snacks: 0 })}
                  className={cn(
                    "flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all gap-2",
                    themeMode === "morning" && "text-slate-900"
                  )}
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Protocol
                </Button>
              </div>
            </Card>
        </div>
      </div>
      <style jsx global>{`
  /* FORCE SCROLLBAR FOR THIS PAGE */
  body {
    overflow-y: auto !important;
  }

  /* Make scrollbar visible */
  body::-webkit-scrollbar {
    width: 8px;
  }

  body::-webkit-scrollbar-track {
    background: transparent;
  }

  body::-webkit-scrollbar-thumb {
    background: linear-gradient(
      180deg,
      rgba(124, 58, 237, 0.9),
      rgba(217, 70, 239, 0.9)
    );
    border-radius: 999px;
  }

  body::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(
      180deg,
      rgba(124, 58, 237, 1),
      rgba(217, 70, 239, 1)
    );
  }
`}</style>

    </main>
  );
}
