"use client";

import { motion } from "motion/react";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4 sm:gap-5 py-4 sm:py-6 px-1 sm:px-2"
    >
      <div>
        <h2 className="text-glow-cyan font-bold text-sm tracking-tight">
          Yogi AI &mdash; Portfolio Assistant
        </h2>
        <p className="text-console-text-dim/70 text-xs mt-1.5 leading-relaxed">
          Ask me anything about Yoganand&apos;s experience, projects, and skills
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {starters.map((text, i) => (
          <motion.button
            key={text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.15 + i * 0.06,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onClick={() => onStarterClick(text)}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs rounded-lg border border-console-border/50 text-console-text-dim/80 hover:text-glow-green hover:border-glow-green/30 hover:bg-glow-green/5 hover:shadow-glow-sm transition-all duration-200 cursor-pointer"
          >
            {text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
