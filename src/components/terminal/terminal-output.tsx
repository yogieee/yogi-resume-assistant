"use client";

import type { TerminalEntry, CommandOutput } from "@/lib/terminal/types";

/** Exhaustiveness check helper */
function assertNever(x: never): never {
  throw new Error(`Unexpected output type: ${(x as CommandOutput).type}`);
}

function renderOutput(output: CommandOutput) {
  switch (output.type) {
    case "welcome":
    case "help":
    case "about":
    case "skills":
    case "experience":
    case "projects":
    case "architecture":
    case "achievements":
    case "certifications":
    case "contact":
    case "resume":
      return (
        <div className="text-console-text-dim italic">
          [ {output.type} output ]
        </div>
      );

    case "clear":
      // Clear is intercepted by the reducer and never reaches history,
      // but we handle it for type completeness
      return null;

    case "error":
      return (
        <div className="text-glow-red">
          Unknown command: &apos;{output.input}&apos;. Type &apos;help&apos; for
          available commands.
        </div>
      );

    default:
      return assertNever(output);
  }
}

export function TerminalOutputEntry({ entry }: { entry: TerminalEntry }) {
  return (
    <div className="space-y-1">
      {entry.command !== undefined && (
        <div className="text-console-text-dim">
          <span className="text-glow-green">{">"}</span> {entry.command}
        </div>
      )}
      {renderOutput(entry.output)}
    </div>
  );
}
