"use client";

import { useState } from "react";
import { BadgeLoader } from "@/components/badge-loader";
import { ProfileActions } from "@/components/profile-actions";
import { TerminalShell } from "@/components/terminal/terminal-shell";
import { AiShell } from "@/components/ai/ai-shell";
import { ModeToggle } from "@/components/mode-toggle";
import { portfolio } from "@/data/portfolio";

const { about } = portfolio;

type Mode = "ai" | "terminal";

export default function Home() {
  const [mode, setMode] = useState<Mode>("ai");

  return (
    <main className="h-dvh max-h-dvh flex flex-col overflow-hidden bg-topological isolate">
      {/* Top bar: Name & Role */}
      <header className="shrink-0 px-4 py-3 sm:px-6 sm:py-4 border-b border-console-border/50 bg-black/40 backdrop-blur-sm relative z-10">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-glow-green">{about.name}</h1>
        <p className="text-xs sm:text-sm text-console-text-dim uppercase tracking-widest">
          {about.role}
        </p>
      </header>

      {/* Mid section: 3D card (left) + Terminal/AI (right) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[400px_1fr] xl:grid-cols-[520px_1fr] 2xl:grid-cols-[600px_1fr] gap-0 min-h-0 relative z-10">
        {/* Left: Interactive 3D Badge — hidden on mobile */}
        <div className="relative hidden md:flex flex-col border-r border-console-border/50 min-h-0 h-full overflow-hidden">
          <BadgeLoader />
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-console-text-dim/60 tracking-widest uppercase pointer-events-none animate-pulse">
            Interactive 3D Badge — Drag to play
          </p>
        </div>

        {/* Right: Mode Toggle + Shell */}
        <div className="flex flex-col min-h-0 h-full">
          <div className="shrink-0 px-3 py-2 sm:px-4 border-b border-console-border/30 bg-console-surface/50">
            <ModeToggle mode={mode} onToggle={setMode} />
          </div>
          {mode === "ai" ? (
            <AiShell active={mode === "ai"} onSwitchToTerminal={() => setMode("terminal")} />
          ) : (
            <TerminalShell />
          )}
        </div>
      </div>

      {/* Footer: Social links & Download */}
      <footer className="shrink-0 px-4 py-3 sm:px-6 sm:py-4 border-t border-console-border/50 relative z-10">
        <ProfileActions />
      </footer>
    </main>
  );
}
