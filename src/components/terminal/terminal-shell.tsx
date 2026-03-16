"use client";

import { useReducer, useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { terminalReducer, initialState } from "@/lib/terminal/reducer";
import { TerminalInput } from "./terminal-input";
import type { TerminalInputHandle } from "./terminal-input";
import { TerminalOutputEntry } from "./terminal-output";
import { ResumeDialog } from "@/components/resume-dialog";

export function TerminalShell() {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TerminalInputHandle>(null);
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);

  // Auto-scroll on new history entries
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.history.length]);

  // Resume download side effect
  useEffect(() => {
    const latest = state.history[state.history.length - 1];
    if (latest?.output.type === "resume") {
      setResumeDialogOpen(true);
    }
  }, [state.history]);

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT", value });
  }, []);

  const handleSubmit = useCallback((command: string) => {
    dispatch({ type: "SUBMIT_COMMAND", command });
  }, []);

  const handleHistoryUp = useCallback(() => {
    dispatch({ type: "HISTORY_UP" });
  }, []);

  const handleHistoryDown = useCallback(() => {
    dispatch({ type: "HISTORY_DOWN" });
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="flex flex-col h-full min-h-0 bg-console-bg/80 text-xs sm:text-[13px] leading-relaxed cursor-text"
    >
      {/* Window chrome */}
      <div className="shrink-0 px-3 py-2.5 sm:px-4 border-b border-console-border/30 bg-console-surface/40 flex items-center gap-1.5 sm:gap-2 cursor-default">
        <span className="size-2.5 sm:size-3 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 sm:size-3 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 sm:size-3 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 sm:ml-4 text-console-text-dim/60 text-[11px] tracking-wide truncate">
          yogi@portfolio &mdash; terminal
        </span>
      </div>

      {/* Scrollable terminal flow */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        <AnimatePresence>
          {state.history.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              layout={false}
            >
              <TerminalOutputEntry entry={entry} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Active prompt */}
        <TerminalInput
          ref={inputRef}
          value={state.inputValue}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onHistoryUp={handleHistoryUp}
          onHistoryDown={handleHistoryDown}
        />
        <div ref={bottomRef} />
      </div>

      <ResumeDialog
        open={resumeDialogOpen}
        onClose={() => setResumeDialogOpen(false)}
      />
    </div>
  );
}
