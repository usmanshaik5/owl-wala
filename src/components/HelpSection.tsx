"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function HelpSection({
  themeMode = "night",
}: {
  themeMode?: "night" | "morning";
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const subject = encodeURIComponent(
      `NIGHT OWL Support: ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    const mailtoUrl = `mailto:support@nightowl.study?subject=${subject}&body=${body}`;

    await new Promise((r) => setTimeout(r, 1500));

    toast.success("Neural Link Established", {
      description: "Launching your communication terminal...",
    });

    window.location.href = mailtoUrl;

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
 <section
  className="
    w-full
    h-screen
    flex
    justify-center
    overflow-x-hidden
    overflow-y-auto
    px-4
    sm:px-6
    lg:px-8 
    pt-8
    pb-24
    custom-scrollbar
  "
>

      <div
        className="
          w-full
          max-w-6xl
          flex
          flex-col
          items-center
          gap-12
        "
      >
        {/* Header */}
        <header className="text-center space-y-4">
         

          <h1
            className={cn(
              "text-2xl sm:text-2xl md:text-3xl font-display font-black tracking-tight  mt-2 sm:mt-4 md:mt-6", themeMode === "night" ? "text-white" : "text-slate-900"
            )}
          >
            HELP MODULE
          </h1>

       
        </header>

        {/* Form */}
        <Card
          className={cn(
            "w-full max-w-xl p-6 sm:p-8 border-2 shadow-2xl",
            themeMode === "night"
              ? "glass border-primary/10"
              : "bg-white border-slate-200"
          )}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
           Name
              </Label>
              <Input
                required
                placeholder=""
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={cn(
                  "h-14 rounded-2xl border-2 font-bold",
                  themeMode === "night"
                    ? "bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10"
                    : "bg-slate-50 border-slate-100 focus:border-violet-500/50 focus:bg-white"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
               Email
              </Label>
              <Input
                required
                type="email"
                placeholder=""
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={cn(
                  "h-14 rounded-2xl border-2 font-bold",
                  themeMode === "night"
                    ? "bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10"
                    : "bg-slate-50 border-slate-100 focus:border-violet-500/50 focus:bg-white"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
               Issue
              </Label>
              <Textarea
                required
                placeholder=""
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className={cn(
                  "min-h-[150px] rounded-2xl border-2 font-bold resize-none",
                  themeMode === "night"
                    ? "bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10"
                    : "bg-slate-50 border-slate-100 focus:border-violet-500/50 focus:bg-white"
                )}
              />
            </div>

            <Button
              disabled={isSubmitting}
              type="submit"
              className={cn(
                "w-full h-16 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all active:scale-[0.98]",
                themeMode === "night"
                  ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
                  : "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/20"
              )}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Transmitting...
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    Initialize Transmission
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
