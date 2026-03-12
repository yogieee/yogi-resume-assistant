"use client";

import { useState } from "react";
import { portfolio } from "@/data/portfolio";
import { TypingEffect } from "../typing-effect";

export function WelcomeOutput() {
  const [introDone, setIntroDone] = useState(false);
  const [welcomeDone, setWelcomeDone] = useState(false);

  return (
    <div className="space-y-1">
      <div className="text-console-text">
        <TypingEffect speed={40} onComplete={() => setIntroDone(true)}>
          {`Hi, I'm ${portfolio.about.name}, a ${portfolio.about.role}.`}
        </TypingEffect>
      </div>
      {introDone && (
        <div className="text-console-text-dim">
          <TypingEffect speed={40} onComplete={() => setWelcomeDone(true)}>
            {"Welcome to my interactive 'AI powered' portfolio terminal!"}
          </TypingEffect>
        </div>
      )}
      {welcomeDone && (
        <div className="text-console-text">
          Type{" "}
          <span className="text-glow-cyan">&apos;help&apos;</span> to see
          available commands.
        </div>
      )}
    </div>
  );
}
