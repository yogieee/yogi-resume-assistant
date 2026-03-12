"use client";

import { forwardRef, useImperativeHandle, useRef, useState, useMemo } from "react";
import { getCompletions } from "@/lib/terminal/commands";
import { Autocomplete } from "./autocomplete";

export interface TerminalInputHandle {
  focus: () => void;
}

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (command: string) => void;
  onHistoryUp: () => void;
  onHistoryDown: () => void;
}

export const TerminalInput = forwardRef<TerminalInputHandle, TerminalInputProps>(
  function TerminalInput({ value, onChange, onSubmit, onHistoryUp, onHistoryDown }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    const handleChange = (newValue: string) => {
      setSuggestions([]);
      onChange(newValue);
    };

    const handleSubmit = (cmd: string) => {
      setSuggestions([]);
      onSubmit(cmd);
    };

    const handleSelectSuggestion = (command: string) => {
      setSuggestions([]);
      onChange(command);
      inputRef.current?.focus();
    };

    // Ghost text: show the rest of the top completion as dimmed hint
    const ghostSuffix = useMemo(() => {
      const trimmed = value.trim().toLowerCase();
      if (!trimmed) return "";
      const matches = getCompletions(trimmed);
      if (matches.length === 0) return "";
      // Show the remaining characters of the first match
      return matches[0].slice(trimmed.length);
    }, [value]);

    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(value);
          }}
          className="flex items-center"
        >
          <span className="text-glow-green font-bold select-none">yogi@portfolio</span>
          <span className="text-console-text-dim select-none">&nbsp;%&nbsp;</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const matches = getCompletions(value);
                  if (matches.length === 1) {
                    onChange(matches[0]);
                    setSuggestions([]);
                  } else if (matches.length > 1) {
                    setSuggestions(matches);
                  } else {
                    setSuggestions([]);
                  }
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  onHistoryUp();
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  onHistoryDown();
                }
              }}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              className="w-full bg-transparent border-none outline-none ring-0 text-console-text caret-glow-green focus:outline-none focus:ring-0"
            />
            {ghostSuffix && (
              <span className="pointer-events-none absolute top-0 left-0 whitespace-pre text-console-text-dim/40">
                <span className="invisible">{value}</span>
                {ghostSuffix}
              </span>
            )}
          </div>
        </form>
        <Autocomplete suggestions={suggestions} onSelect={handleSelectSuggestion} />
      </div>
    );
  }
);
