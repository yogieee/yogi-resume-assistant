import { COMMANDS } from "@/lib/terminal/commands";

export function HelpOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Available Commands</div>
      <div className="grid grid-cols-[120px_1fr] gap-y-1">
        {Object.entries(COMMANDS).map(([name, { description }]) => (
          <div key={name} className="contents">
            <span className="text-glow-cyan">{name}</span>
            <span className="text-console-text-dim">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
