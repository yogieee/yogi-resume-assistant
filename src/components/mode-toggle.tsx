"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type Mode = "ai" | "terminal";

interface ModeToggleProps {
  mode: Mode;
  onToggle: (mode: Mode) => void;
}

export function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  const [transitioning, setTransitioning] = useState<string | null>(null);

  useEffect(() => {
    if (transitioning) {
      const timer = setTimeout(() => setTransitioning(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [transitioning]);

  const handleToggle = (newMode: Mode) => {
    if (newMode === mode) return;
    setTransitioning(
      newMode === "ai" ? "Switching to Yogi AI..." : "Switching to Developer Console..."
    );
    onToggle(newMode);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex rounded-lg border border-console-border/60 bg-console-bg/50 overflow-hidden">
        {/* Sliding indicator */}
        <motion.div
          className="absolute inset-y-0 w-1/2 rounded-[7px] bg-glow-green/10 border border-glow-green/20"
          animate={{ x: mode === "ai" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <button
          onClick={() => handleToggle("ai")}
          className={`relative z-10 px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer ${
            mode === "ai"
              ? "text-glow-green"
              : "text-console-text-dim hover:text-console-text"
          }`}
        >
          Yogi AI
        </button>
        <button
          onClick={() => handleToggle("terminal")}
          className={`relative z-10 px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 cursor-pointer ${
            mode === "terminal"
              ? "text-glow-green"
              : "text-console-text-dim hover:text-console-text"
          }`}
        >
          Terminal
        </button>
      </div>

      <AnimatePresence>
        {transitioning && (
          <motion.span
            initial={{ opacity: 0, x: -8, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-[11px] text-console-text-dim/70 hidden sm:inline"
          >
            {transitioning}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
