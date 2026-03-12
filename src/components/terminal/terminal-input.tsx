"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export interface TerminalInputHandle {
  focus: () => void;
}

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (command: string) => void;
}

export const TerminalInput = forwardRef<TerminalInputHandle, TerminalInputProps>(
  function TerminalInput({ value, onChange, onSubmit }, ref) {
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
        className="flex items-center gap-2 px-4 py-3 border-t border-console-border bg-console-surface"
      >
        <span className="text-glow-green font-bold select-none">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          placeholder="Type a command..."
          className="flex-1 bg-transparent border-none outline-none ring-0 text-console-text caret-glow-green placeholder:text-console-text-dim/40 focus:outline-none focus:ring-0"
        />
      </form>
    );
  }
);
