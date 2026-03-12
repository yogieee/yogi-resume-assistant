import type { CommandOutput } from "./types";

/** Command registry with descriptions for help output */
export const COMMANDS = {
  help: { description: "Show available commands" },
  about: { description: "Professional summary" },
  skills: { description: "Technical skills by category" },
  experience: { description: "Career timeline" },
  projects: { description: "Project showcase" },
  architecture: { description: "System architecture diagram" },
  achievements: { description: "Key achievements with metrics" },
  certifications: { description: "Professional certifications" },
  contact: { description: "Contact information" },
  resume: { description: "Download resume PDF" },
  clear: { description: "Clear terminal" },
} as const satisfies Record<string, { description: string }>;

/** Union type of all valid command names */
export type CommandName = keyof typeof COMMANDS;

/**
 * Parse a raw input string into a typed CommandOutput.
 *
 * - Trims and lowercases input
 * - Returns typed output for known commands (including "clear")
 * - Returns error output with the original trimmed input for unknown commands
 */
export function parseCommand(input: string): CommandOutput {
  const trimmed = input.trim().toLowerCase();

  if (trimmed in COMMANDS) {
    return { type: trimmed as CommandName };
  }

  return { type: "error", input: trimmed };
}
