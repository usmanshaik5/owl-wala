"use client";

import { useState, useEffect, useRef } from "react";
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Zap,
  Sparkles,
  Target,
  Flame,
  Box,
  Plus,
  Check,
  Trash2,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export function TimerSection({
  themeMode = "night",
}: {
  themeMode?: "night" | "morning";
}) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editMinutes, setEditMinutes] = useState("25");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime =
    mode === "focus" ? parseInt(editMinutes || "25") * 60 : 5 * 60;
  const progress = timeLeft / totalTime;

  useEffect(() => {
    setMounted(true);
    const savedMinutes = localStorage.getItem("owl-focus-minutes");
    const savedTasks = localStorage.getItem("owl-timer-tasks");

    if (savedMinutes) {
      setEditMinutes(savedMinutes);
      setTimeLeft(parseInt(savedMinutes) * 60);
    }

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error("Failed to parse saved tasks");
      }
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("owl-timer-tasks", JSON.stringify(tasks));
    }
  }, [tasks, isDataLoaded]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  async function handleComplete() {
    setIsActive(false);
    if (mode === "focus") {
      toast.success("Objective Secured. Time for recalibration. ✨", {
        description: "Focus session verified. Initiating 5-minute cooldown.",
      });
      setMode("break");
      setTimeLeft(5 * 60);

      if (supabase) {
        try {
          await supabase
            .from("study_sessions")
            .insert([
              { duration_minutes: parseInt(editMinutes), mode: "focus" },
            ]);
        } catch (error: any) {
          console.error("Failed to save session:", error.message || error);
        }
      }
    } else {
      toast.info("Break Protocol Ended. Returning to operational state. 🌙", {
        description: "Focus mode re-engaged.",
      });
      setMode("focus");
      setTimeLeft(parseInt(editMinutes) * 60);

      if (supabase) {
        try {
          await supabase
            .from("study_sessions")
            .insert([{ duration_minutes: 5, mode: "break" }]);
        } catch (error: any) {
          console.error(
            "Failed to save break session:",
            error.message || error
          );
        }
      }
    }
  }

  function toggleTimer() {
    setIsActive(!isActive);
  }

  function resetTimer() {
    setIsActive(false);
    setTimeLeft(mode === "focus" ? parseInt(editMinutes) * 60 : 5 * 60);
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const handleTimeChange = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(editMinutes);
    if (!isNaN(mins) && mins > 0 && mins <= 120) {
      setTimeLeft(mins * 60);
      setIsEditingTime(false);
      localStorage.setItem("owl-focus-minutes", editMinutes);
      toast.success(`Timer set to ${mins} minutes`);
    } else {
      toast.error("Enter a valid time (1-120 mins)");
    }
  };

  const handleTimeBlur = () => {
    const mins = parseInt(editMinutes);
    if (!isNaN(mins) && mins > 0 && mins <= 120) {
      setTimeLeft(mins * 60);
      localStorage.setItem("owl-focus-minutes", editMinutes);
    } else {
      setEditMinutes(Math.floor(timeLeft / 60).toString());
    }
    setIsEditingTime(false);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
    toast.success("Task added to focus queue");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
  flex-1
  flex flex-col
  items-stretch
  justify-start
  px-4 sm:px-6 md:px-10
  py-6 sm:py-8 md:py-10
  space-y-6 md:space-y-8
  overflow-y-auto
  pb-20 sm:pb-28
  custom-scrollbar
"
    >
      <header className="text-center space-y-2 md:space-y-4 pt-17 md:pt-12">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2 md:gap-4"
        >
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-1.5 md:px-5 md:py-2 rounded-2xl border shadow-2xl uppercase tracking-[0.3em] font-black text-[8px] md:text-[10px] transition-colors duration-500",
              mode === "focus"
                ? themeMode === "night"
                  ? "bg-primary/10 text-primary"
                  : "bg-violet-500/10 text-violet-600"
                : "bg-accent/10 text-accent",
              themeMode === "night" ? "border-white/5" : "border-slate-200"
            )}
          >
            {mode === "focus" ? (
              <Zap className="w-3 h-3 fill-current" />
            ) : (
              <Coffee className="w-3 h-3" />
            )}
            {mode} PROTOCOL
          </div>
        </motion.div>
      </header>

      <div className="flex flex-col   ml-6  items-center justify-center gap-6 md:gap-12 w-[90%] max-w-5xl flex-1">
        <div className="flex flex-col items-center gap-4 md:gap-8 w-full">
          <motion.div
            whileHover="hover"
            className="relative flex items-center justify-center group 
           scale-[0.65] xs:scale-[0.75] sm:scale-[0.85] md:scale-100"
          >
            <div
              className={cn(
                "absolute inset-0 blur-[80px] md:blur-[120px] rounded-full transition-all duration-1000 animate-pulse",
                themeMode === "night"
                  ? "bg-primary/20 group-hover:bg-primary/30"
                  : "bg-violet-400/20 group-hover:bg-violet-400/30"
              )}
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  variants={{
                    hover: {
                      scale: [0, 1.1, 1],
                      opacity: [0, 0.5, 0.15],
                      transition: {
                        delay: i * 0.1,
                        duration: 0.8,
                        ease: "easeOut",
                      },
                    },
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  className={cn(
                    "absolute rounded-full border-2",
                    themeMode === "night"
                      ? "border-primary/40 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)]"
                      : "border-violet-500/40 shadow-[0_0_20px_rgba(124,58,237,0.1)]"
                  )}
                  style={{
                    width: `${(i + 1) * 20}%`,
                    height: `${(i + 1) * 20}%`,
                    maxWidth: "480px",
                    maxHeight: "480px",
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center">
              {isEditingTime ? (
                <form
                  onSubmit={handleTimeChange}
                  className="relative z-30 pointer-events-auto"
                >
                  <Input
                    autoFocus
                    value={editMinutes}
                    onChange={(e) => setEditMinutes(e.target.value)}
                    onBlur={handleTimeBlur}
                    className={cn(
                      "w-32 md:w-40 text-5xl md:text-7xl font-display font-black text-center bg-transparent border-none focus-visible:ring-0 tabular-nums p-0 h-auto",
                      themeMode === "morning" && "text-slate-900"
                    )}
                  />
                  <div
                    className={cn(
                      "text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mt-2",
                      themeMode === "night" ? "text-primary" : "text-violet-600"
                    )}
                  >
                    Enter Minutes
                  </div>
                </form>
              ) : (
                <motion.div
                  key={timeLeft}
                  initial={{ scale: 0.9, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => !isActive && setIsEditingTime(true)}
                  className={cn(
                    "text-5xl xs:text-6xl sm:text-7xl md:text-9xl lg:text-[10rem] font-display font-black tabular-nums tracking-tighterest cursor-pointer transition-colors pointer-events-auto",
                    themeMode === "night"
                      ? "hover:text-primary"
                      : "hover:text-violet-600 text-slate-900",
                    isActive ? "cursor-default" : ""
                  )}
                >
                  {formatTime(timeLeft)}
                </motion.div>
              )}

              <div
                className={cn(
                  "flex items-center gap-3 -mt-2 md:-mt-4",
                  themeMode === "night"
                    ? "text-primary/60"
                    : "text-violet-600/60"
                )}
              >
                <div className="flex gap-1">
                  <span
                    className={cn(
                      "w-1 h-1 rounded-full animate-ping",
                      themeMode === "night" ? "bg-primary" : "bg-violet-600"
                    )}
                  />
                  <span
                    className={cn(
                      "w-1 h-1 rounded-full animate-ping [animation-delay:0.2s]",
                      themeMode === "night" ? "bg-primary" : "bg-violet-600"
                    )}
                  />
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full animate-ping [animation-delay:0.4s]",
                      themeMode === "night" ? "bg-primary" : "bg-violet-600"
                    )}
                  />
                </div>
                <span className="text-[11px] mt-5 md:text-[10px] font-black uppercase tracking-[0.5em]">
                  {isActive ? "Operational" : "Standby"}
                </span>
              </div>
            </div>
            <svg
              viewBox="0 0 300 300"
              className="w-[240px] h-[240px] 
             xs:w-[280px] xs:h-[280px]
             sm:w-[320px] sm:h-[320px]
             md:w-[420px] md:h-[420px] md:h-[450px] -rotate-90 relative z-10 filter drop-shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]"
            >
              <circle
                cx="50%"
                cy="50%"
                r={radius}
                className={cn(
                  "fill-none",
                  themeMode === "night" ? "stroke-white/5" : "stroke-slate-200"
                )}
                strokeWidth="4"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r={radius}
                className={cn(
                  "fill-none",
                  themeMode === "night" ? "stroke-primary" : "stroke-violet-600"
                )}
                strokeWidth="12"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "linear" }}
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          <div className="flex items-center gap-6 md:gap-10 relative z-10">
            <Button
              variant="outline"
              onClick={resetTimer}
              className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl border transition-all active:scale-90",
                themeMode === "night"
                  ? "glass glass-hover border-white/5 text-muted-foreground hover:text-primary"
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-violet-600"
              )}
            >
              <RotateCcw className="w-6 h-6 md:w-8 md:h-8" />
            </Button>

            <Button
              onClick={toggleTimer}
              className={cn(
                "w-24 h-24 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] text-xl font-bold hover:scale-110 active:scale-95 transition-all group",
                themeMode === "night"
                  ? "bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_80px_-15px_rgba(var(--primary-rgb),0.6)]"
                  : "bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_80px_-15px_rgba(124,58,237,0.4)]"
              )}
            >
              {isActive ? (
                <Pause className="w-10 h-10 md:w-12 md:h-12" />
              ) : (
                <Play className="w-10 h-10 md:w-12 md:h-12 ml-1 md:ml-2 fill-current group-hover:scale-110 transition-transform" />
              )}
            </Button>

            {!isActive && (
              <Button
                variant="outline"
                onClick={() => setIsEditingTime(true)}
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl border transition-all active:scale-90",
                  themeMode === "night"
                    ? "glass glass-hover border-white/5 text-muted-foreground hover:text-primary"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-violet-600"
                )}
              >
                <Edit2 className="w-6 h-6 md:w-8 md:h-8" />
              </Button>
            )}
          </div>
        </div>

        {/* Task Queue Section */}
        <div className="w-full max-w-md mt-35  flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-3 md:gap-4 -mt-30">
            <h2
              className={cn(
                "text-lg md:text-xl font-display font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-colors duration-500",
                themeMode === "night" ? "text-white" : "text-slate-900"
              )}
            >
              Objective Queue
            </h2>
       <form onSubmit={addTask} className="relative group">
  <textarea
    placeholder="DEFINE NEXT MISSION..."
    value={newTaskText}
    onChange={(e) => setNewTaskText(e.target.value)}
    onInput={(e) => {
      const el = e.currentTarget;
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }}
    rows={1}
    className={cn(
      "w-full resize-none overflow-hidden rounded-xl md:rounded-2xl min-h-[3rem] md:min-h-[3.5rem] pl-5 md:pl-6 pr-16 py-3 font-bold uppercase tracking-wider transition-all text-xs md:text-sm leading-relaxed",
      themeMode === "night"
        ? "bg-white/5 border border-white/10 focus:bg-white/10 text-white placeholder:text-white/40"
        : "bg-white border border-slate-200 focus:bg-slate-50 text-slate-900 placeholder:text-slate-400"
    )}
  />

  <Button
    type="submit"
    aria-label="Add task"
    className={cn(
      "absolute right-3 top-1/2 -translate-y-1/2 h-9 md:h-10 w-9 md:w-10 p-0 flex items-center justify-center rounded-lg md:rounded-xl transition-all",
      themeMode === "night"
        ? "bg-primary hover:bg-primary/80"
        : "bg-violet-600 hover:bg-violet-700 text-white"
    )}
  >
    <Send className="w-4 h-4 md:w-5 md:h-5" />
  </Button>
</form>

          </div>

          <div
            className="space-y-2 md:space-y-3 max-h-[220px] xs:max-h-[260px] sm:max-h-[300px] md:max-h-[400px]
 overflow-y-auto pr-2 custom-scrollbar"
          >
            <AnimatePresence mode="popLayout">
              {tasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "p-8 border-2 border-dashed rounded-[2rem] text-center",
                    themeMode === "night"
                      ? "border-white/5"
                      : "border-slate-100"
                  )}
                >
                  <Box
                    className={cn(
                      "w-10 h-10 mx-auto mb-4",
                      themeMode === "night" ? "text-white/10" : "text-slate-200"
                    )}
                  />
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                    No objectives initialized
                  </p>
                </motion.div>
              ) : (
                tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-2xl border transition-all",
                      task.completed
                        ? themeMode === "night"
                          ? "bg-primary/5 border-primary/20 opacity-60"
                          : "bg-violet-50 border-violet-100 opacity-60"
                        : themeMode === "night"
                          ? "bg-white/5 border-white/5 hover:border-white/20"
                          : "bg-white border-slate-100 hover:border-slate-300 text-slate-900"
                    )}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={cn(
                        "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                        task.completed
                          ? themeMode === "night"
                            ? "bg-primary border-primary"
                            : "bg-violet-500 border-violet-500"
                          : themeMode === "night"
                            ? "border-white/20 hover:border-primary/50"
                            : "border-slate-200 hover:border-violet-400"
                      )}
                    >
                      {task.completed && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </button>
                    <span
                      className={cn(
                        "flex-1 min-w-0 font-bold uppercase tracking-wide text-sm break-words whitespace-pre-wrap leading-relaxed",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.text}
                    </span>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        className={cn(
          "relative mt-auto w-full max-w-md rounded-[2rem] border p-8 text-center transition-all duration-500",
          themeMode === "night"
            ? "glass border-white/10"
            : "bg-white border-slate-200 shadow-xl"
        )}
      >
        <p
          className={cn(
            "italic font-bold text-sm md:text-base",
            "leading-7 md:leading-8 break-words whitespace-normal",
            themeMode === "night" ? "text-white/80" : "text-slate-700"
          )}
        >
          {themeMode === "night"
            ? "“The night is not a barrier, it is a canvas for your evolution. Your momentum is undeniable.”"
            : "“Sunrise is the universe rewarding your commitment. Every minute today is a new chance to excel.”"}
        </p>
      </motion.div>
    </motion.div>
  );
}
