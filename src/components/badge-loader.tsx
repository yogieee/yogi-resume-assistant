"use client";

import dynamic from "next/dynamic";

const BadgeScene = dynamic(
  () => import("@/components/badge-scene").then((mod) => mod.BadgeScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-console-bg text-glow-green/60 text-[10px] font-mono tracking-[0.15em] uppercase">
        <span style={{ animation: "cursor-blink 1s steps(1) infinite" }}>
          INITIALIZING 3D BADGE_SYSTEM...
        </span>
      </div>
    ),
  },
);

export function BadgeLoader() {
  return <BadgeScene />;
}
