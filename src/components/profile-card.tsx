"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { MapPin } from "lucide-react";

import { portfolio } from "@/data/portfolio";

const { about } = portfolio;

export function ProfileCard() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={
        hasEntered
          ? { opacity: 1, y: [0, -8, 0], scale: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={
        hasEntered
          ? { y: { duration: 5, ease: "easeInOut", repeat: Infinity } }
          : { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
      }
      onAnimationComplete={() => {
        if (!hasEntered) setHasEntered(true);
      }}
      className="flex flex-col items-center w-full max-w-[260px] mx-auto"
    >
      {/* Lanyard string */}
      <div className="w-px h-16 bg-linear-to-b from-console-border/0 via-console-text-dim/30 to-console-text-dim/60" />

      {/* Lanyard clip ring */}
      <div className="relative z-10 -mb-2.5">
        <div className="size-5 rounded-full border-2 border-console-text-dim/40 bg-console-bg/80" />
      </div>

      {/* ID Badge Card */}
      <div className="relative w-full overflow-hidden rounded-xl bg-console-surface/80 backdrop-blur-xl border border-console-border/40 shadow-xl shadow-black/40">
        {/* Badge header */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <div className="size-5 rounded bg-glow-green/15 flex items-center justify-center">
            <span className="text-[10px] font-bold text-glow-green">Y</span>
          </div>
          <span className="text-[11px] text-console-text-dim/60 font-mono">
            {about.name.toLowerCase().replace(/\s+/g, "")}
          </span>
        </div>

        {/* Avatar */}
        <div className="px-3 pb-3">
          <div className="w-full aspect-3/4 rounded-lg bg-console-elevated/80 border border-console-border/30 flex items-center justify-center">
            <span className="text-5xl font-bold text-glow-green/40">YG</span>
          </div>
        </div>

        {/* Badge footer */}
        <div className="px-3 pb-3">
          <div className="flex items-center gap-1 text-[11px] text-console-text-dim/60">
            <MapPin className="size-3 shrink-0" />
            <span>{about.location}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
