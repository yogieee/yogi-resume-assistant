import { BadgeLoader } from "@/components/badge-loader";
import { ProfileActions } from "@/components/profile-actions";
import { TerminalShell } from "@/components/terminal/terminal-shell";
import { portfolio } from "@/data/portfolio";

const { about } = portfolio;

export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden bg-topological">
      {/* Top bar: Name & Role */}
      <header className="shrink-0 px-6 py-4 border-b border-console-border/50 bg-black/40 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-glow-green">{about.name}</h1>
        <p className="text-sm text-console-text-dim uppercase tracking-widest">
          {about.role}
        </p>
      </header>

      {/* Mid section: 3D card (left) + Terminal (right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[600px_1fr] gap-0 min-h-0">
        {/* Left: Interactive 3D Badge */}
        <div className="relative flex flex-col border-r border-console-border/50 h-[500px] lg:h-full overflow-hidden">
          <BadgeLoader />
          <p className="absolute bottom-4 left-0 right-0 text-center text-xs text-console-text-dim/60 tracking-widest uppercase pointer-events-none animate-pulse">
            Interactive 3D Badge — Drag to play
          </p>
        </div>

        {/* Right: Terminal */}
        <div className="flex flex-col min-h-[300px]">
          <TerminalShell />
        </div>
      </div>

      {/* Footer: Social links & Download */}
      <footer className="shrink-0 px-6 py-4 border-t border-console-border/50">
        <ProfileActions />
      </footer>
    </main>
  );
}
