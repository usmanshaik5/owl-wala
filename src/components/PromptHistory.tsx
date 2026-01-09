"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PromptHistoryItem {
  id?: string;
  content: string;
}

interface PromptHistoryProps {
  history: PromptHistoryItem[];
  themeMode: "night" | "morning";
  onSelect: (prompt: string) => void;
  onRemoveItem: (id: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PromptHistory({
  history,
  themeMode,
  onSelect,
  onRemoveItem,
  onClear,
  isOpen,
  onClose,
}: PromptHistoryProps) {
  const safeHistory = history.filter(
    (item) => item.content && item.content.trim().length > 0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKDROP */}
          <div
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* HISTORY PANEL */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className={cn(
              "relative w-80 h-full flex flex-col",
              themeMode === "night"
                ? "bg-[#0b0b0b] text-white"
                : "bg-white text-black"
            )}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="text-sm font-bold uppercase tracking-widest">
                History
              </h2>

              <Button
                size="icon"
                variant="ghost"
                onClick={onClear}
                className="hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* LIST */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {safeHistory.length === 0 ? (
                <p className="text-center text-xs opacity-60 mt-10">
                  No history yet
                </p>
              ) : (
                safeHistory.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className={cn(
                      "group flex items-start gap-2 p-3 rounded-lg cursor-pointer",
                      themeMode === "night"
                        ? "bg-white/5 hover:bg-white/10"
                        : "bg-slate-100 hover:bg-slate-200"
                    )}
                  >
                    <button
                      onClick={() => onSelect(item.content)}
                      className="flex-1 text-left text-xs leading-relaxed"
                    >
                      {item.content}
                    </button>

                    {item.id && (
                      <button
                        onClick={() => onRemoveItem(item.id!)}
                        className="opacity-0 group-hover:opacity-100 transition text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
