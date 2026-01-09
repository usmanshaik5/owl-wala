"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatSection } from "@/components/ChatSection";
import { PlannerSection } from "@/components/PlannerSection";
import { TimerSection } from "@/components/TimerSection";
import { VitalitySection } from "@/components/VitalitySection";
import { HelpSection } from "@/components/HelpSection";
import { SleepGameSection } from "@/components/SleepGameSection";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { HistorySection } from "@/components/Sidebar";
import {
  Menu,
  PanelLeft,
  ShieldAlert,
  AlertTriangle,
  RefreshCcw,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Section = "chat" | "history"| "planner" | "timer" | "dashboard" | "help" | "lab";
type ThemeMode = "night" | "morning";

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("chat");
  const [themeMode, setThemeMode] = useState<ThemeMode>("night");
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [stars, setStars] = useState<
    { top: string; left: string; duration: number; delay: number }[]
  >([]);

  const handleClearAll = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("owl-")) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  useEffect(() => {
    setMounted(true);
    const savedSection = localStorage.getItem("owl-active-section") as Section;
    const savedTheme = localStorage.getItem("owl-theme-mode") as ThemeMode;

    if (savedSection) setActiveSection(savedSection);
    if (savedTheme) setThemeMode(savedTheme);

    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }

    const newStars = [...Array(20)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("owl-active-section", activeSection);
    }
  }, [activeSection, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("owl-theme-mode", themeMode);
    }
  }, [themeMode, mounted]);

 const renderSection = () => {
  switch (activeSection) {
    case "chat":
      return <ChatSection themeMode={themeMode} />;

    case "history":
      return (
        <HistorySection
          history={JSON.parse(localStorage.getItem("owl-prompt-history") || "[]")}
          themeMode={themeMode}
          onSelect={(prompt) => {
            setActiveSection("chat");
            // optional: pass prompt to chat input later
          }}
          onRemoveItem={(id) => {
            const data = JSON.parse(localStorage.getItem("owl-prompt-history") || "[]");
            const updated = data.filter((item: any) => item.id !== id);
            localStorage.setItem("owl-prompt-history", JSON.stringify(updated));
          }}
          onClear={() => {
            localStorage.removeItem("owl-prompt-history");
          }}
        />
      );

    case "planner":
      return <PlannerSection themeMode={themeMode} />;

    case "timer":
      return <TimerSection themeMode={themeMode} />;

    case "dashboard":
      return (
        <VitalitySection
          themeMode={themeMode}
          setActiveSection={setActiveSection}
        />
      );

    case "help":
      return <HelpSection themeMode={themeMode} />;

    case "lab":
      return <SleepGameSection themeMode={themeMode} />;

    default:
      return <ChatSection themeMode={themeMode} />;
  }
};


  return (
    <div
      className={cn(
        "flex min-h-screen overflow-x-hidden selection:bg-primary/30 font-sans transition-colors duration-1000",
        themeMode === "night"
          ? "bg-[#050505] text-white"
          : "bg-white text-slate-900"
      )}
    >
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onClearAll={() => setIsClearDialogOpen(true)}
      />

   <main className="flex-1 relative flex flex-col min-h-0">



       <AlertDialog
  open={isClearDialogOpen}
  onOpenChange={setIsClearDialogOpen}
>
  <AlertDialogContent
    className={cn(
      "max-w-sm rounded-xl p-6",
      themeMode === "night"
        ? "bg-background border border-white/10 text-white"
        : "bg-white border border-slate-200 text-slate-900"
    )}
  >
    <AlertDialogHeader>
      <AlertDialogTitle
        className={cn(
          "text-lg font-semibold text-center",
          themeMode === "night" ? "text-white" : "text-slate-900"
        )}
      >
        Clear all data?
      </AlertDialogTitle>

      <AlertDialogDescription
        className={cn(
          "text-sm text-center mt-2",
          themeMode === "night" ? "text-white/60" : "text-slate-500"
        )}
      >
        This will permanently delete your saved data and cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter className="mt-6 flex gap-3">
 <AlertDialogCancel
  className={cn(
    "h-10 rounded-md px-4 text-sm border transition-colors",
    themeMode === "night"
      ? "bg-white/5 hover:bg-white/10 text-white hover:text-white border-white/10"
      : "bg-slate-100 hover:bg-slate-200 text-black hover:text-black border-slate-300"
  )}
>
  Cancel
</AlertDialogCancel>



      <AlertDialogAction
  onClick={handleClearAll}
  className={cn(
    "h-10 rounded-md px-4 text-sm font-medium",
    themeMode === "night"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-red-500 hover:bg-red-600 text-black"
  )}
>
  Clear
</AlertDialogAction>

    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


        {!isSidebarOpen && (
          <motion.button
            suppressHydrationWarning
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "hidden md:flex absolute top-6 left-6 z-50 p-2.5 rounded-xl border transition-all duration-500",
              themeMode === "night"
                ? "bg-[#0A0A0A]/80 border-white/5 text-muted-foreground hover:text-white"
                : "bg-white/80 border-black/5 text-slate-500 hover:text-slate-900"
            )}
          >
            <PanelLeft className="w-6 h-6" />
          </motion.button>
        )}

 <header
  className={cn(
    "md:hidden fixed top-0 left-0 right-0 z-50",
    "flex items-center justify-between px-6 py-4 border-b",
    themeMode === "night"
      ? "bg-[#050505]/95 backdrop-blur border-white/5"
      : "bg-white/95 backdrop-blur border-black/5"
  )}
>
  <button
    suppressHydrationWarning
    onClick={() => setIsSidebarOpen(true)}
    className={cn(
      "p-2 -ml-2 rounded-xl transition-colors",
      themeMode === "night" ? "hover:bg-white/10 text-white" : "hover:bg-black/10 text-black"
    )}
  >
    <Menu className="w-6 h-6" />
  </button>

  <div className="flex items-center gap-2">
    <span
      suppressHydrationWarning
      className={cn(
        "font-display font-black tracking-tight text-xl transition-colors duration-500",
        themeMode === "night" ? "text-white" : "text-black"
      )}
    >
      {themeMode === "night" ? "NIGHT OWL" : "DAY OWL"}
    </span>
  </div>

  <div className="w-8" />
</header>


        <AnimatePresence mode="wait">
          {themeMode === "night" ? (
            <motion.div
              key="night-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-violet-600/20 blur-[150px] rounded-full animate-pulse" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse delay-1000" />

              <div className="absolute inset-0 opacity-30">
                {mounted &&
                  stars.map((star, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        top: star.top,
                        left: star.left,
                      }}
                      animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: star.duration,
                        repeat: Infinity,
                        delay: star.delay,
                      }}
                    />
                  ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="morning-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              <div className="absolute top-[-20%] left-[10%] w-[70%] h-[70%] bg-violet-200/40 blur-[180px] rounded-full animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-200/30 blur-[150px] rounded-full animate-pulse delay-700" />
              <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-fuchsia-100/30 blur-[120px] rounded-full animate-pulse delay-1000" />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={themeMode}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "absolute inset-0 pointer-events-none z-[100]",
              themeMode === "night" ? "bg-black" : "bg-white"
            )}
          />
        </AnimatePresence>

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="relative flex-1 overflow-y-auto flex flex-col min-h-0">

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
               className="flex-1 flex flex-col min-h-0"
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Toaster
        position="top-right"
        theme="dark"
        closeButton
        toastOptions={{
          style: {
            background: "oklch(0.15 0.02 280 / 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid oklch(1 0 0 / 0.1)",
            borderRadius: "12px",
            padding: "8px 12px",
            fontSize: "13px",
            color: "white",
            fontWeight: "600",
          },
        }}
      />
    </div>
  );
}
