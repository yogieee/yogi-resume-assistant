"use client";

import { useReducer, useRef, useEffect, useCallback } from "react";
import { terminalReducer, initialState } from "@/lib/terminal/reducer";
import { TerminalInput } from "./terminal-input";
import type { TerminalInputHandle } from "./terminal-input";
import { TerminalOutputEntry } from "./terminal-output";

export function TerminalShell() {
  const [state, dispatch] = useReducer(terminalReducer, initialState);
  const containerRef = useRef<HTMLDivElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TerminalInputHandle>(null);

  // Auto-scroll on new history entries
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.history.length]);

  // Resume download side effect
  useEffect(() => {
    const latest = state.history[state.history.length - 1];
    if (latest?.output.type === "resume") {
      const link = document.createElement("a");
      link.href = "/resume.pdf";
      link.download = "Yoganand_Govind_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [state.history]);

  // Click-to-focus: clicking anywhere in terminal focuses the input
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = useCallback((value: string) => {
    dispatch({ type: "SET_INPUT", value });
  }, []);

  const handleSubmit = useCallback((command: string) => {
    dispatch({ type: "SUBMIT_COMMAND", command });
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="flex flex-col h-full bg-console-bg"
    >
      {/* Header */}
      <div className="shrink-0 px-4 py-2 border-b border-console-border bg-console-surface flex items-center gap-2">
        <span className="size-2 rounded-full bg-glow-green" />
        <span className="text-glow-green text-sm font-bold tracking-wide">
          Yogi Dev Console v1.0
        </span>
      </div>

      {/* Scrollable output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.history.map((entry) => (
          <TerminalOutputEntry key={entry.id} entry={entry} />
        ))}
        <div ref={outputEndRef} />
      </div>

      {/* Input */}
      <TerminalInput
        ref={inputRef}
        value={state.inputValue}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
