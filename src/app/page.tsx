import { BadgeLoader } from "@/components/badge-loader";
import { ProfileActions } from "@/components/profile-actions";
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

        {/* Right: Terminal area */}
        <div className="flex flex-col min-h-[300px] bg-black">
          <div className="flex-1 flex flex-col items-center justify-center border-l border-console-border/50 bg-grid-mesh">
            <div className="space-y-2 text-center animate-in fade-in zoom-in duration-700">
              <p className="text-glow-green text-sm font-mono tracking-tighter">
                &gt; SYSTEM_READY: PHASE_3_DEPLOYED
              </p>
              <div className="flex gap-2 justify-center">
                <span className="size-1.5 rounded-full bg-glow-green animate-pulse" />
                <span className="size-1.5 rounded-full bg-glow-green/40 animate-pulse delay-75" />
                <span className="size-1.5 rounded-full bg-glow-green/10 animate-pulse delay-150" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Social links & Download */}
      <footer className="shrink-0 px-6 py-4 border-t border-console-border/50">
        <ProfileActions />
      </footer>
    </main>
  );
}
