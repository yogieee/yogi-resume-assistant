"use client";

import dynamic from "next/dynamic";

const BadgeScene = dynamic(
  () => import("@/components/badge-scene").then((mod) => mod.BadgeScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full bg-black text-glow-green text-xs font-mono border border-console-border animate-pulse shadow-glow-sm">
        INITIALIZING 3D BADGE_SYSTEM...
      </div>
    ),
  },
);

export function BadgeLoader() {
  return <BadgeScene />;
}
