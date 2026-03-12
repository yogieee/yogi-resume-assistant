"use client";

interface AiWelcomeProps {
  onStarterClick: (text: string) => void;
}

const starters = [
  "What can Yoganand build for me?",
  "Tell me about Autowired.ai",
  "What cloud technologies does he use?",
  "Why should I hire Yoganand?",
  "I have a project idea",
];

export function AiWelcome({ onStarterClick }: AiWelcomeProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 py-4 sm:py-6 px-1 sm:px-2">
      <div>
        <h2 className="text-glow-cyan font-bold text-sm">
          Yogi AI &mdash; Portfolio Assistant
        </h2>
        <p className="text-console-text-dim text-xs mt-1">
          Ask me anything about Yoganand&apos;s experience, projects, and skills
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {starters.map((text) => (
          <button
            key={text}
            onClick={() => onStarterClick(text)}
            className="px-2 py-1 sm:px-3 sm:py-1.5 text-xs rounded-full border border-console-border text-console-text-dim hover:text-glow-green hover:border-glow-green/40 hover:shadow-glow-sm transition-all duration-200"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
