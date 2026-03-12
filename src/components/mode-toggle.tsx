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
      const timer = setTimeout(() => setTransitioning(null), 800);
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
      <div className="flex rounded-md border border-console-border bg-console-surface overflow-hidden">
        <button
          onClick={() => handleToggle("ai")}
          className={`px-3 py-1 text-xs font-medium transition-colors duration-200 ${
            mode === "ai"
              ? "bg-glow-green/15 text-glow-green"
              : "text-console-text-dim hover:text-console-text"
          }`}
        >
          Yogi AI
        </button>
        <button
          onClick={() => handleToggle("terminal")}
          className={`px-3 py-1 text-xs font-medium transition-colors duration-200 border-l border-console-border ${
            mode === "terminal"
              ? "bg-glow-green/15 text-glow-green"
              : "text-console-text-dim hover:text-console-text"
          }`}
        >
          Terminal
        </button>
      </div>

      <AnimatePresence>
        {transitioning && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-console-text-dim hidden sm:inline"
          >
            {transitioning}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
