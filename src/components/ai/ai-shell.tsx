"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { AiWelcome } from "./ai-welcome";
import { AiMessage } from "./ai-message";
import { AiThinking } from "./ai-thinking";

interface AiShellProps {
  active: boolean;
}

function getErrorMessage(error: Error): string {
  const msg = error.message ?? "";
  if (msg.includes("429") || msg.toLowerCase().includes("too many")) {
    return "I\u2019m getting a lot of questions right now. Try again in a moment.";
  }
  return "Something went wrong on my end. Please try again.";
}

export function AiShell({ active }: AiShellProps) {
  const { messages, sendMessage, status, error, stop } = useChat({
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "submitted" || status === "streaming";

  // Stop streaming when switching away from AI mode
  useEffect(() => {
    if (!active) {
      stop();
    }
  }, [active, stop]);

  // Auto-scroll on new messages or status change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, status]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: trimmed }],
    });
    setInput("");
  };

  const handleStarterClick = (text: string) => {
    handleSend(text);
  };

  const isThinking = status === "submitted";

  return (
    <div className="flex flex-col h-full min-h-0 bg-console-bg text-xs sm:text-[13px] leading-relaxed">
      {/* Window chrome */}
      <div className="shrink-0 px-3 py-2 sm:px-4 border-b border-console-border bg-console-surface flex items-center gap-1.5 sm:gap-2">
        <span className="size-2.5 sm:size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 sm:size-3 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 sm:size-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 sm:ml-4 text-console-text-dim text-xs truncate">
          yogi@portfolio &mdash; ai
        </span>
      </div>

      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
        {messages.length === 0 ? (
          <AiWelcome onStarterClick={handleStarterClick} />
        ) : (
          messages.map((message) => (
            <AiMessage key={message.id} message={message} />
          ))
        )}

        {isThinking && <AiThinking />}

        {error && (
          <div className="py-1.5 px-2">
            <span className="text-glow-cyan text-xs font-bold">
              yogi-ai &gt;&nbsp;
            </span>
            <span className="text-console-text-dim text-xs">
              {getErrorMessage(error)}
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-console-border bg-console-surface px-3 py-2 sm:px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center"
        >
          <span className="text-glow-cyan font-bold select-none">ask</span>
          <span className="text-console-text-dim select-none">
            &nbsp;&gt;&nbsp;
          </span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isBusy}
            placeholder={
              isBusy
                ? "Thinking..."
                : "Ask about Yogi's experience, projects, skills..."
            }
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent border-none outline-none ring-0 text-console-text caret-glow-cyan placeholder:text-console-text-dim/40 focus:outline-none focus:ring-0 disabled:opacity-50"
          />
        </form>
      </div>
    </div>
  );
}
