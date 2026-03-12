"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const duration = children.length / speed;
    const controls = animate(0, children.length, {
      duration,
      ease: "linear",
      onUpdate: (v) => setCharCount(Math.round(v)),
      onComplete: () => {
        setDone(true);
        onCompleteRef.current?.();
      },
    });
    return () => controls.stop();
  }, [children, speed]);

  const skip = useCallback(() => {
    if (!done) {
      setCharCount(children.length);
      setDone(true);
      onCompleteRef.current?.();
    }
  }, [done, children.length]);

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
