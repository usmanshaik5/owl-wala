"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Moon,
  Clock,
  BookOpen,
  Wand2,
  Target,
  ShieldCheck,
} from "lucide-react";
import { generateStudyPlanAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function PlannerSection({
  themeMode = "night",
}: {
  themeMode?: "night" | "morning";
}) {
  const [subjects, setSubjects] = useState("");
  const [hours, setHours] = useState("");
  const [topics, setTopics] = useState("");
  const [startTime, setStartTime] = useState("");
  const [plan, setPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSubjects(localStorage.getItem("owl-planner-subjects") || "");
    setHours(localStorage.getItem("owl-planner-hours") || "");
    setTopics(localStorage.getItem("owl-planner-topics") || "");
    setStartTime(localStorage.getItem("owl-planner-start-time") || "");
    setPlan(localStorage.getItem("owl-planner-plan") || null);
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("owl-planner-subjects", subjects);
      localStorage.setItem("owl-planner-hours", hours);
      localStorage.setItem("owl-planner-topics", topics);
      localStorage.setItem("owl-planner-start-time", startTime);
      if (plan) {
        localStorage.setItem("owl-planner-plan", plan);
      } else {
        localStorage.removeItem("owl-planner-plan");
      }
    }
  }, [subjects, hours, topics, startTime, plan, isDataLoaded]);

  async function generatePlan() {
    if (!subjects || !hours || isLoading) return;
    setIsLoading(true);

    try {
      const prompt = `COMMAND: INITIALIZE STRATEGIC BLUEPRINT
    SUBJECTS: ${subjects}
    CRITICAL TOPICS: ${topics}
    TARGET DURATION: ${hours}
    START TIME: ${startTime || "IMMEDIATE"}
    THEME: ${themeMode}
    
      INSTRUCTIONS:
      1. Generate an ELITE, highly detailed study plan for a ${hours} session starting at ${startTime || "now"}.
      2. Use a motivational, ${themeMode === "night" ? "Night Owl" : "Early Bird"} tactical tone.
      3. Every minute must be productive. Break the ${hours} into high-intensity focus blocks.
      4. IMPORTANT: Use ONLY proper Markdown bullet points (using - or *) for tasks. 
      5. Each time block (e.g., 8:00 PM - 9:00 PM) MUST be on its own line and start with the time.
      6. AVOID complex Markdown symbols like *** or #####. Use simple H2 headers and bullet points only.
      7. Ensure the plan is extremely easy to read with clean spacing between points.`;

      const response = await generateStudyPlanAction(prompt);
      setPlan(response);

      if (supabase) {
        try {
          await supabase.from("study_plans").insert([
            {
              subjects,
              topics,
              hours,
              start_time: startTime,
              plan_content: response,
            },
          ]);
        } catch (error: any) {
          console.error("Failed to save study plan:", error.message || error);
        }
      }
    } catch (error) {
      setPlan(
        "failed to generate plan. check your connection and try again! ⚡"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 mt-22 max-w-5xl mx-auto p-2  space-y-4 md:space-y-8 overflow-y-auto pb-24 custom-scrollbar "
    >
      <header className="space-y-2 p-2 md:p-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div>
            <h1
              className={cn(
                "text-lg md:text-4xl font-display font-black tracking-tighter uppercase transition-all duration-500",
                themeMode === "night" ? "text-white" : "text-slate-900"
              )}
            >
              Plan Your work
            </h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 p-2 md:p-0">
        {[
          {
            label: "Subjects",
            icon: BookOpen,
            value: subjects,
            setter: setSubjects,
            placeholder: "Your Subject",
          },
          {
            label: "Critical Topics",
            icon: Sparkles,
            value: topics,
            setter: setTopics,
            placeholder: "Your Topic",
          },
          {
            label: "Target Hours",
            icon: Clock,
            value: hours,
            setter: setHours,
            placeholder: "1h or 45m",
          },
          {
            label: "Start Time",
            icon: Moon,
            value: startTime,
            setter: setStartTime,
            placeholder: "10AM or 10 PM",
          },
        ].map((field, i) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-2 group"
          >
            <label
              className={cn(
                "text-[12px] mt-8 font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                themeMode === "night"
                  ? "text-muted-foreground group-focus-within:text-accent"
                  : "text-black/70 group-focus-within:text-black"
              )}
            >
              {field.label}
            </label>
            <Input
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className={cn(
                "h-14 md:h-16 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm px-4 md:px-6 transition-all",
                themeMode === "night"
                  ? "glass border-white/5 focus-visible:ring-accent"
                  : "bg-white border-slate-200 focus-visible:ring-violet"
              )}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          onClick={generatePlan}
          disabled={isLoading || !subjects || !hours}
          className={cn(
            "w-full h-16 md:h-20 text-lg md:text-xl font-display font-black uppercase tracking-widest rounded-2xl md:rounded-3xl shadow-2xl transition-all active:scale-[0.98] group",
            themeMode === "night"
              ? "bg-accent hover:bg-accent/80 text-accent-foreground shadow-accent/20 md:hover:scale-[1.02]"
              : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20 md:hover:scale-[1.02]"
          )}
        >
          {isLoading ? (
            <div className="flex items-center gap-3 md:gap-4">
              <Loader2 className="w-6 h-6 md:w-8 md:h-8 animate-spin" />
              <span>Calibrating Directive...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 md:gap-4">
              <Wand2 className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
              <span>Initialize Strategic Plan</span>
            </div>
          )}
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        {plan && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <Card
              className={cn(
                "border-none shadow-2xl relative overflow-hidden group transition-all duration-500",
                themeMode === "night" ? "glass" : "bg-white shadow-slate-200/50"
              )}
            >
              <div className="absolute top-0 right-0 p-4 md:p-8 transition-opacity">
                <Target
                  className="w-24 h-24 md:w-48 md:h-48 
               text-black dark:text-white 
               opacity-20 dark:opacity-40 
               group-hover:opacity-40 dark:group-hover:opacity-60"
                />
              </div>

              <CardHeader
                className={cn(
                  "p-6 md:p-8 pb-4 relative z-10 border-b",
                  themeMode === "night" ? "border-white/5" : "border-slate-100"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 md:gap-4",
                    themeMode === "night" ? "text-accent" : "text-violet-600"
                  )}
                >
                
                  <div>
                    <CardTitle
                      className={cn(
                        "text-xl md:text-3xl font-display font-black uppercase tracking-tight",
                        themeMode === "morning" && "text-slate-900"
                      )}
                    >
                      Active Directive
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 -mt-5 md:p-10 relative z-10">
                <div
                  className={cn(
                    "p-5 md:p-10 rounded-2xl md:rounded-[3rem] border shadow-inner transition-all duration-500",
                    themeMode === "night"
                      ? "bg-black/20 border-white/5"
                      : "bg-slate-50 border-slate-100"
                  )}
                >
                  <div
                    className={cn(
                      "prose max-w-none prose-p:leading-relaxed prose-p:mb-2 md:prose-p:mb-3 prose-headings:mb-3 md:prose-headings:mb-4 prose-headings:mt-4 md:prose-headings:mt-6 prose-li:my-1 md:prose-li:my-1.5 prose-li:list-disc text-sm md:text-lg tracking-wide",
                      themeMode === "night"
                        ? "prose-invert prose-li:marker:text-accent prose-strong:text-accent prose-strong:font-black"
                        : "text-slate-900 prose-li:marker:text-violet-500 prose-strong:text-violet-600 prose-strong:font-black"
                    )}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => {
                          // Extract text content from children to check for timing pattern
                          const content = Array.isArray(children)
                            ? children
                                .map((c) => (typeof c === "string" ? c : ""))
                                .join("")
                            : typeof children === "string"
                              ? children
                              : "";

                          // Check for "8:00 PM" or "**8:00 PM" style timing blocks
                          const isTimeBlock = /^\d{1,2}:\d{2}/.test(
                            content.trim().replace(/^\**/, "")
                          );

                          return (
                            <p
                              className={cn(
                                "leading-relaxed mb-2 md:mb-3 transition-colors duration-500",
                                isTimeBlock &&
                                  cn(
                                    "mt-4 md:mt-6 pt-3 border-t font-black text-lg md:text-2xl tracking-tight",
                                    themeMode === "night"
                                      ? "border-white/5 text-accent"
                                      : "border-slate-200 text-violet-600"
                                  )
                              )}
                            >
                              {children}
                            </p>
                          );
                        },
                        li: ({ children }) => (
                          <li
                            className={cn(
                              "my-1 md:my-1.5 font-medium list-disc ml-6 transition-colors duration-500",
                              themeMode === "night"
                                ? "marker:text-accent"
                                : "marker:text-violet-500"
                            )}
                          >
                            {children}
                          </li>
                        ),
                        h2: ({ children }) => (
                          <h2
                            className={cn(
                              "text-xl md:text-3xl font-black uppercase tracking-tighter mt-6 mb-3 pb-2 border-b-2 transition-colors duration-500",
                              themeMode === "night"
                                ? "text-accent border-accent/20"
                                : "text-violet-600 border-violet-200"
                            )}
                          >
                            {children}
                          </h2>
                        ),
                        strong: ({ children }) => (
                          <strong
                            className={cn(
                              "font-black transition-colors duration-500",
                              themeMode === "night"
                                ? "text-accent"
                                : "text-violet-600"
                            )}
                          >
                            {children}
                          </strong>
                        ),
                      }}
                    >
                      {plan}
                    </ReactMarkdown>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
