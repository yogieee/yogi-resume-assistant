import { COMMANDS } from "@/lib/terminal/commands";

export function HelpOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Available Commands</div>
      <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[180px_1fr] gap-y-1">
        {Object.entries(COMMANDS).map(([name, { description }]) => (
          <div key={name} className="contents">
            <span className="text-glow-cyan">{name}</span>
            <span className="text-console-text-dim">{description}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1">
        <div className="text-console-text-dim/50 text-xs italic">
          Psst... try these hidden commands:
        </div>
        <div className="text-console-text-dim/30 text-xs">
          sudo &middot; matrix &middot; whoami &middot; 404 &middot; hack &middot; coffee &middot; ping
        </div>
      </div>
    </div>
  );
}
