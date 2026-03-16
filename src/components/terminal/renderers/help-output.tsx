import { COMMANDS } from "@/lib/terminal/commands";

export function HelpOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Available Commands</div>
      <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[160px_1fr] gap-y-1.5">
        {Object.entries(COMMANDS).map(([name, { description }]) => (
          <div key={name} className="contents">
            <span className="text-glow-cyan">{name}</span>
            <span className="text-console-text-dim">{description}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2 border-t border-console-border/30 space-y-1">
        <div className="text-console-text-dim/60 text-xs italic">
          Psst... try these hidden commands:
        </div>
        <div className="text-console-text-dim/40 text-xs">
          sudo &middot; matrix &middot; whoami &middot; 404 &middot; hack &middot; coffee &middot; ping
        </div>
      </div>
    </div>
  );
}
