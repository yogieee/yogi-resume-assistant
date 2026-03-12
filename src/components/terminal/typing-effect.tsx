"use client";

import { useState, useEffect, useCallback } from "react";
import { animate } from "motion/react";

interface TypingEffectProps {
  children: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypingEffect({
  children,
  speed = 40,
  onComplete,
}: TypingEffectProps) {
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = children.length / speed;
    const controls = animate(0, children.length, {
      duration,
      ease: "linear",
      onUpdate: (v) => setCharCount(Math.round(v)),
      onComplete: () => {
        setDone(true);
        onComplete?.();
      },
    });
    return () => controls.stop();
  }, [children, speed, onComplete]);

  const skip = useCallback(() => {
    if (!done) {
      setCharCount(children.length);
      setDone(true);
      onComplete?.();
    }
  }, [done, children.length, onComplete]);

  return (
    <span
      onClick={skip}
      className={done ? undefined : "cursor-pointer"}
    >
      {children.slice(0, charCount)}
      {!done && <span className="animate-pulse text-glow-green">|</span>}
    </span>
  );
}
