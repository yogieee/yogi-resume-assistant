"use client";

interface AiWelcomeProps {
  onStarterClick: (text: string) => void;
}

const starters = [
  "What are Yogi's key skills?",
  "Tell me about Autowired.ai",
  "What cloud technologies does he use?",
  "Why hire Yoganand?",
  "Start a project discussion",
];

export function AiWelcome({ onStarterClick }: AiWelcomeProps) {
  return (
    <div className="flex flex-col gap-4 py-6 px-2">
      <div>
        <h2 className="text-glow-cyan font-bold text-sm">
          Yogi AI &mdash; Portfolio Assistant
        </h2>
        <p className="text-console-text-dim text-xs mt-1">
          Ask me anything about Yoganand&apos;s experience, projects, and skills
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {starters.map((text) => (
          <button
            key={text}
            onClick={() => onStarterClick(text)}
            className="px-3 py-1.5 text-xs rounded-full border border-console-border text-console-text-dim hover:text-glow-green hover:border-glow-green/40 hover:shadow-glow-sm transition-all duration-200"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
