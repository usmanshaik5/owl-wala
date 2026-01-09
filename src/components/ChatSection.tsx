"use client";

import { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Brain,
  Cpu,
  Zap,
  History,
} from "lucide-react";
import { Message, STUDY_BUDDY_SYSTEM_PROMPT } from "@/lib/groq";
import { chatWithGroqAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
// import { PromptHistory } from "./PromptHistory";
// import { Send } from "lucide-react";
import { PromptHistory } from "./PromptHistory";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sidebar } from "./Sidebar";
export function ChatSection({
  themeMode = "night",
}: {
  themeMode?: "night" | "morning";
}) {
  const [userName, setUserName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState<
    { id: string; content: string }[]
  >([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedName = localStorage.getItem("owl-user-name");
    const savedHistory = localStorage.getItem("owl-prompt-history");
    const savedMessages = localStorage.getItem("owl-chat-messages");

    if (savedName) {
      setUserName(savedName);
    }

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    } else if (savedName) {
      setMessages([
        {
          id: "welcome-msg",
          role: "assistant",
          content:
            themeMode === "night"
              ? `Welcome back, ${savedName}. Operational. Standing by for strategic directives. What are we conquering tonight? 🦉✨`
              : `Good morning, ${savedName}. Sunlight detected. Cognitive sensors recalibrated. What is on the agenda for today? 🦉☀️`,
        },
      ]);
    }

    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === "string") {
            setPromptHistory(
              parsed.map((content: string) => ({
                id: crypto.randomUUID(),

                content,
              }))
            );
          } else {
            setPromptHistory(
              parsed.map((item: any) => ({
                id:
                  typeof item?.id === "string" && item.id.trim().length > 0
                    ? item.id
                    : crypto.randomUUID(),
                content: String(item.content ?? ""),
              }))
            );
          }
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("owl-chat-messages", JSON.stringify(messages));
    }
  }, [messages, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("owl-prompt-history", JSON.stringify(promptHistory));
    }
  }, [promptHistory, isDataLoaded]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const name = nameInput.trim();
    setUserName(name);
    localStorage.setItem("owl-user-name", name);
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          themeMode === "night"
            ? `Identification confirmed: ${name}. Operational. Standing by for strategic directives. What are we conquering tonight? 🦉✨`
            : `Identification confirmed: ${name}. Cognitive sensors recalibrated. What is on the agenda for today? 🦉☀️`,
      },
    ]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const messageId = crypto.randomUUID();

    const userMessage: Message = {
      id: messageId,
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Update prompt history (last 5)
    setPromptHistory((prev) => [
      {
        id: crypto.randomUUID(), // ✅ unique ALWAYS
        content: input,
      },
      ...prev.filter((p) => p.content !== input),
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithGroqAction([
        {
          role: "system",
          content: `${STUDY_BUDDY_SYSTEM_PROMPT}\n\nThe user's name is ${userName}. Use it naturally in conversation.`,
        },
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: userMessage.role, content: userMessage.content },
      ]);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response,
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Signal interference detected. Please re-transmit. ⚡",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const removeHistoryItem = (id: string) => {
    setPromptHistory((prev) => prev.filter((item) => item.id !== id));
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    };

 return (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col h-[100dvh] max-w-5xl mx-auto p-2 gap-2 md:gap-8 overflow-hidden"
  >
    {/* HEADER – NEVER SCROLLS */}
    <header className="flex items-center justify-between shrink-0 p-13 md:p-0">
      <div className="flex items-center gap-2 md:gap-4">
        <div>
          <h1
            className={cn(
              "text-lg mt-10 md:text-3xl font-display font-black tracking-wider uppercase transition-all duration-500",
              themeMode === "night" ? "text-white" : "text-slate-900"
            )}
          >
            Let's Study
          </h1>
        </div>
      </div>
    </header>

    {/* MAIN CONTAINER */}
    <div className="flex-1 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col relative min-h-0 transition-all duration-500">
      {!userName ? (
        /* NAME SCREEN – NO SCROLL */
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-8 relative z-10">
          <form
            onSubmit={handleNameSubmit}
            className="w-full max-w-sm flex flex-col gap-4"
          >
            <Input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter your name..."
              className={cn(
                "h-14 rounded-2xl bg-transparent border-none text-center font-bold text-lg",
                themeMode === "night"
                  ? "text-white placeholder:text-white"
                  : "text-black placeholder:text-black"
              )}
            />
            <Button
              type="submit"
              disabled={!nameInput.trim()}
              className="h-14 rounded-2xl font-black uppercase"
            >
              Synchronize Interface
            </Button>
          </form>
        </div>
      ) : (
        <>
          {/* CHAT SCROLL AREA – ONLY THIS SCROLLS */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 overscroll-contain"
          >
            <div className="space-y-6 md:space-y-8">
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={m.id ?? `msg-${i}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 md:gap-4 max-w-[95%] md:max-w-[80%]",
                      m.role === "user" &&
                        "ml-auto flex-row-reverse text-right"
                    )}
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 bg-white text-black">
                      {m.role === "user" ? <User /> : <Bot />}
                    </div>

                    <div
                      className={cn(
                        "p-3.5 md:p-5 rounded-2xl md:rounded-3xl text-sm md:text-base font-bold border",
                        themeMode === "night"
                          ? "bg-white/5 border-white/10 text-white"
                          : "bg-white border-slate-200 text-slate-900"
                      )}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="flex gap-3 items-center opacity-60">
                  <Cpu className="animate-spin" />
                  <span className="text-xs font-bold uppercase">
                    Synthesizing…
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* INPUT BAR – STICKY, NOT SCROLLING */}
          <div
            className={cn(
              "sticky bottom-0 z-50 p-4 md:p-6 border-t backdrop-blur-xl",
              themeMode === "night"
                ? "border-white/5 bg-white/5"
                : "border-slate-200 bg-slate-50"
            )}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-3 md:gap-4"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="enter your prompt..."
                className="h-12 md:h-14 rounded-xl md:rounded-2xl font-bold"
              />
              <Button type="submit" disabled={isLoading}>
                <Send />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  </motion.div>
);

}
