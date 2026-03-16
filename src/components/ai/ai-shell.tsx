"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion } from "motion/react";
import { AiWelcome } from "./ai-welcome";
import { AiMessage } from "./ai-message";
import { AiThinking } from "./ai-thinking";

interface AiShellProps {
  active: boolean;
  onSwitchToTerminal?: () => void;
}

function isRateLimitError(error: Error): boolean {
  const msg = error.message ?? "";
  return msg.includes("429") || msg.toLowerCase().includes("too many");
}

export function AiShell({ active, onSwitchToTerminal }: AiShellProps) {
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
    <div className="flex flex-col h-full min-h-0 bg-console-bg/80 text-xs sm:text-[13px] leading-relaxed">
      {/* Window chrome */}
      <div className="shrink-0 px-3 py-2.5 sm:px-4 border-b border-console-border/30 bg-console-surface/40 flex items-center gap-1.5 sm:gap-2">
        <span className="size-2.5 sm:size-3 rounded-full bg-[#ff5f57]/80" />
        <span className="size-2.5 sm:size-3 rounded-full bg-[#febc2e]/80" />
        <span className="size-2.5 sm:size-3 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 sm:ml-4 text-console-text-dim/60 text-[11px] tracking-wide truncate">
          yogi@portfolio &mdash; ai
        </span>
      </div>

      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
        {messages.length === 0 ? (
          <AiWelcome onStarterClick={handleStarterClick} />
        ) : (
          messages.map((message, i) => (
            <AiMessage key={message.id} message={message} index={i} />
          ))
        )}

        {isThinking && <AiThinking />}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="py-1.5 px-2"
          >
            <span className="text-glow-cyan text-xs font-bold">
              yogi-ai &gt;&nbsp;
            </span>
            {isRateLimitError(error) ? (
              <span className="text-console-text-dim text-xs">
                I&apos;m getting a lot of questions right now!
                {onSwitchToTerminal ? (
                  <>
                    {" "}Meanwhile, you can explore Yogi&apos;s portfolio using the{" "}
                    <button
                      type="button"
                      onClick={onSwitchToTerminal}
                      className="text-glow-green underline underline-offset-2 hover:brightness-125 transition-all duration-200 cursor-pointer"
                    >
                      terminal
                    </button>
                    {" "}&mdash; type <code className="text-glow-cyan bg-console-elevated/50 px-1 py-0.5 rounded">help</code> to get started.
                  </>
                ) : (
                  " Try again in a moment."
                )}
              </span>
            ) : (
              <span className="text-console-text-dim text-xs">
                Something went wrong on my end. Please try again.
              </span>
            )}
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-console-border/30 bg-console-surface/50 backdrop-blur-sm px-3 py-2.5 sm:px-4 sm:py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center"
        >
          <span className="text-glow-cyan font-bold select-none">ask</span>
          <span className="text-console-text-dim/50 select-none">
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
            className="flex-1 bg-transparent border-none outline-none ring-0 text-console-text caret-glow-cyan placeholder:text-console-text-dim/30 focus:outline-none focus:ring-0 disabled:opacity-40"
          />
        </form>
      </div>
    </div>
  );
}
