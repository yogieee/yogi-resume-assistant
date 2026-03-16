"use client";

import { motion } from "motion/react";

interface AutocompleteProps {
  suggestions: string[];
  onSelect: (command: string) => void;
}

export function Autocomplete({ suggestions, onSelect }: AutocompleteProps) {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-wrap gap-1.5 px-4 py-2"
    >
      {suggestions.map((cmd) => (
        <button
          key={cmd}
          type="button"
          onClick={() => onSelect(cmd)}
          className="px-2.5 py-1 text-xs rounded-md bg-console-surface/60 border border-console-border/50 text-glow-green hover:bg-console-elevated hover:border-glow-green/30 hover:shadow-glow-sm transition-all duration-150 cursor-pointer"
        >
          {cmd}
        </button>
      ))}
    </motion.div>
  );
}
