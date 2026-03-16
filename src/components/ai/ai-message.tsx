"use client";

import { motion } from "motion/react";
import type { UIMessage } from "ai";

interface AiMessageProps {
  message: UIMessage;
  index: number;
}

function formatText(text: string): string {
  // Bold: **text** -> <strong>text</strong>
  let formatted = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Inline code: `code` -> <code>code</code>
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="bg-console-elevated/60 px-1 py-0.5 rounded text-glow-green text-[0.85em]">$1</code>'
  );
  return formatted;
}

export function AiMessage({ message, index }: AiMessageProps) {
  const isUser = message.role === "user";
  const prefix = isUser ? "you" : "yogi-ai";
  const prefixColor = isUser ? "text-glow-green" : "text-glow-cyan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.05, 0.15),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="py-1.5 px-2 rounded-md hover:bg-console-surface/30 transition-colors duration-150"
    >
      <span className={`${prefixColor} text-xs font-bold`}>{prefix} &gt;&nbsp;</span>
      <span className="text-console-text text-xs whitespace-pre-wrap">
        {message.parts.map((part, i) => {
          if (part.type === "text") {
            return (
              <span
                key={i}
                dangerouslySetInnerHTML={{ __html: formatText(part.text) }}
              />
            );
          }
          return null;
        })}
      </span>
    </motion.div>
  );
}
