import type { UIMessage } from "ai";

interface AiMessageProps {
  message: UIMessage;
}

function formatText(text: string): string {
  // Bold: **text** -> <strong>text</strong>
  let formatted = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Inline code: `code` -> <code>code</code>
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="bg-console-elevated px-1 py-0.5 rounded text-glow-green text-[0.85em]">$1</code>'
  );
  return formatted;
}

export function AiMessage({ message }: AiMessageProps) {
  const isUser = message.role === "user";
  const prefix = isUser ? "you" : "yogi-ai";
  const prefixColor = isUser ? "text-glow-green" : "text-glow-cyan";

  return (
    <div className="py-1.5 px-2">
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
    </div>
  );
}
