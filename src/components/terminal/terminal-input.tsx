"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

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

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(value);
        }}
        className="flex items-center"
      >
        <span className="text-glow-green font-bold select-none">yogi@portfolio</span>
        <span className="text-console-text-dim select-none">&nbsp;%&nbsp;</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
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
          className="flex-1 bg-transparent border-none outline-none ring-0 text-console-text caret-glow-green focus:outline-none focus:ring-0"
        />
      </form>
    );
  }
);
