"use client";

import { useState } from "react";
import { motion } from "motion/react";
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
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="shrink-0 px-4 py-3 sm:px-6 sm:py-4 border-b border-console-border/40 bg-console-surface/30 backdrop-blur-md relative z-10"
      >
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-glow-green tracking-tight">
          {about.name}
        </h1>
        <p className="text-[11px] sm:text-xs text-console-text-dim uppercase tracking-[0.2em]">
          {about.role}
        </p>
      </motion.header>

      {/* Mid section: 3D card (left) + Terminal/AI (right) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] xl:grid-cols-[500px_1fr] gap-0 min-h-0 relative z-10">
        {/* Left: Interactive 3D Badge -- hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden md:flex flex-col border-r border-console-border/30 min-h-0 h-full overflow-hidden"
        >
          <BadgeLoader />
          <p className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-console-text-dim/40 tracking-[0.15em] uppercase pointer-events-none">
            Interactive 3D Badge &mdash; Drag to play
          </p>
        </motion.div>

        {/* Right: Mode Toggle + Shell */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col min-h-0 h-full"
        >
          <div className="shrink-0 px-3 py-2 sm:px-4 border-b border-console-border/25 bg-console-surface/30 backdrop-blur-sm">
            <ModeToggle mode={mode} onToggle={setMode} />
          </div>
          {mode === "ai" ? (
            <AiShell active={mode === "ai"} onSwitchToTerminal={() => setMode("terminal")} />
          ) : (
            <TerminalShell />
          )}
        </motion.div>
      </div>

      {/* Footer: Social links & Download */}
      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="shrink-0 px-4 py-3 sm:px-6 sm:py-3 border-t border-console-border/40 bg-console-surface/30 backdrop-blur-md relative z-10"
      >
        <ProfileActions />
      </motion.footer>
    </main>
  );
}
