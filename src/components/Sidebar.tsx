"use client";

import {
  MessageSquare,
  Calendar,
  Timer,
  History,
  Activity,
  Moon,
  Sun,
  Sparkles,
  X,
  PanelLeftClose,
  ShieldAlert,
  HelpCircle,
  Zap,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

type Section =
  | "chat"
  | "history"
  | "planner"
  | "timer"
  | "dashboard"
  | "help"
  | "lab";
type ThemeMode = "night" | "morning";

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onClearAll?: () => void;
}
export function HistorySection({
  history,
  themeMode,
  onSelect,
  onRemoveItem,
  onClear,
}: {
  history: { id?: string; content: string }[];
  themeMode: "night" | "morning";
  onSelect: (prompt: string) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col h-full p-6 overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4  mt-30">
        <h2 className="font-black uppercase tracking-widest text-sm">
          History
        </h2>
        {/* <Button variant="ghost" size="icon" onClick={onClear}>
          <Trash2 className="w-4 h-4" />
        </Button> */}
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {history.map((item, i) => (
          <button
            key={item.id ?? i}
            onClick={() => onSelect(item.content)}
            className={cn(
              "w-full p-4 rounded-2xl text-left font-bold",
              themeMode === "night"
                ? "bg-white/5 hover:bg-white/10"
                : "bg-slate-50 hover:bg-slate-100"
            )}
          >
            {item.content}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Sidebar({
  activeSection,
  setActiveSection,
  themeMode,
  setThemeMode,
  isOpen,
  onClose,
  onClearAll,
}: SidebarProps) {
  const items = [
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "history", icon: History, label: "History" },
    { id: "planner", icon: Calendar, label: "Planner" },
    { id: "timer", icon: Timer, label: "Timer" },
    { id: "lab", icon: Zap, label: "Anti Sleep" },
    { id: "dashboard", icon: Activity, label: "Break Time" },
    { id: "help", icon: HelpCircle, label: "Help Module" },
  ];

  const sidebarContent = (
    <>
      {/* ================= STICKY HEADER ================= */}
      <div
        className={cn(
          "sticky top-0 z-40",
          "pt-6 pb-4",
          themeMode === "night"
            ? "bg-[#050505]/95 backdrop-blur border-b border-white/10"
            : "bg-white/95 backdrop-blur border-b border-black/10"
        )}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-50">
          <button
            suppressHydrationWarning
            onClick={onClose}
            className={cn(
              "p-2 rounded-xl transition-colors",
              themeMode === "night"
                ? "hover:bg-white/10 text-white"
                : "hover:bg-black/10 text-black"
            )}
          >
            {isOpen && <PanelLeftClose className="w-6 h-6" />}
          </button>
        </div>

        {/* Dynamic background glow */}
        <div
          className={cn(
            "absolute -top-24 -left-24 w-64 h-64 blur-[120px] rounded-full animate-pulse",
            themeMode === "night" ? "bg-primary/20" : "bg-violet-400/20"
          )}
        />

        {/* Theme Toggle + Title */}
        <div className="flex items-center gap-4 px-2 mt-6 relative z-10">
          <motion.button
            suppressHydrationWarning
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() =>
              setThemeMode(themeMode === "night" ? "morning" : "night")
            }
            className={cn(
              "p-3 rounded-2xl shadow-2xl transition-all duration-700",
              themeMode === "night"
                ? "bg-gradient-to-br from-primary to-violet-600 text-white shadow-primary/20"
                : "bg-gradient-to-br from-violet-400 to-fuchsia-500 text-white shadow-violet-400/20"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {themeMode === "night" ? (
                <motion.div
                  key="moon"
                  initial={{ y: 20, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                >
                  <Moon className="w-6 h-6 fill-current" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ y: 20, opacity: 0, rotate: 45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.4, ease: "backOut" }}
                >
                  <Sun className="w-6 h-6 fill-current" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <span
            className={cn(
              "font-display font-black text-2xl transition-all duration-700",
              themeMode === "night" ? "text-white" : "text-black"
            )}
          >
            NIGHT OWL
          </span>
        </div>
      </div>

      {/* ================= SCROLLABLE CONTENT ================= */}
    <div className="flex-1 overflow-y-auto pt-16 relative z-10 custom-scrollbar">

        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              suppressHydrationWarning
              onClick={() => {
                setActiveSection(item.id as Section);
                if (window.innerWidth < 768 && onClose) onClose();
              }}
              className={cn(
                  "w-full flex items-center gap-4 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden tracking-widest",
  "justify-center text-center md:justify-start md:text-left md:px-4 px-2",
                activeSection === item.id
                  ? themeMode === "night"
                    ? "text-white"
                    : "text-black"
                  : themeMode === "night"
                    ? "text-white/70 hover:text-white"
                    : "text-black hover:text-black"
              )}
            >
              {activeSection === item.id && (
                <motion.span
                  layoutId="active-nav-bg"
                  className={cn(
                    "absolute inset-0 rounded-2xl shadow-2xl",
                    themeMode === "night"
                      ? "bg-gradient-to-r from-primary to-violet-600"
                      : "bg-gradient-to-r from-violet-600 to-fuchsia-600"
                  )}
                />
              )}

              {/* <item.icon className="w-5 h-5 relative z-10" /> */}
              <span className="font-black text-sm tracking-[0.25em] relative z-10">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Clear Data */}
        <div className="pt-8">
         <button
  onClick={() => {
    onClose?.();          // 1️⃣ close sidebar
    setTimeout(() => {
      onClearAll?.();     // 2️⃣ then clear / popup
    }, 150);
  }}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500",
              themeMode === "night"
                ? "text-white/60 hover:text-white hover:bg-white/5"
                : "text-slate-600 hover:text-black hover:bg-black/5"
            )}
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="font-black text-sm uppercase tracking-tight">
              Clear Data
            </span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 288 }}
            exit={{ width: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "hidden md:flex flex-col h-full border-r relative overflow-hidden shrink-0 transition-colors duration-700",
              themeMode === "night"
                ? "bg-[#050505] border-white/5"
                : "bg-white border-black/5"
            )}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-[288px] p-6 shrink-0"
            >
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed inset-y-0 left-0 w-[85%] max-w-sm z-[70]",
              "flex flex-col h-full overflow-visible md:hidden",
              themeMode === "night"
                ? "bg-[#050505]/95 shadow-2xl border-r border-white/5"
                : "bg-white/95 shadow-2xl border-r border-black/5"
            )}
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
