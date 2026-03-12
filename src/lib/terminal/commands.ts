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
  hire: { description: "Work with me / discuss a project" },
  resume: { description: "Download resume PDF" },
  clear: { description: "Clear terminal" },
} as const satisfies Record<string, { description: string }>;

/** Union type of all valid command names */
export type CommandName = keyof typeof COMMANDS;

/** Aliases that map to existing commands */
const ALIASES: Record<string, CommandName> = {
  autowired: "projects",
  autowire: "projects",
  "hire me": "hire",
  hireme: "hire",
  collaborate: "hire",
  freelance: "hire",
  "work with me": "hire",
};

/** Easter egg commands -- hidden, not shown in help */
const EASTER_EGGS = new Set([
  "sudo",
  "matrix",
  "whoami",
  "404",
  "hack",
  "coffee",
  "ping",
]);

/**
 * Parse a raw input string into a typed CommandOutput.
 *
 * - Trims and lowercases input
 * - Returns typed output for known commands (including "clear")
 * - Supports command aliases (e.g. "autowired" -> "projects")
 * - Returns error output with the original trimmed input for unknown commands
 */
export function parseCommand(input: string): CommandOutput {
  const trimmed = input.trim().toLowerCase();

  if (trimmed in COMMANDS) {
    return { type: trimmed as CommandName };
  }

  if (trimmed in ALIASES) {
    return { type: ALIASES[trimmed] };
  }

  if (EASTER_EGGS.has(trimmed)) {
    return { type: "easter-egg", egg: trimmed };
  }

  return { type: "error", input: trimmed };
}

/**
 * Return command names that start with the given input (case-insensitive).
 * Excludes exact matches so typing a full command shows no suggestions.
 * Returns results sorted alphabetically.
 */
export function getCompletions(input: string): string[] {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return [];

  const commandNames = Object.keys(COMMANDS) as CommandName[];
  const aliasNames = Object.keys(ALIASES);
  const all = [...commandNames, ...aliasNames];

  return all
    .filter((cmd) => cmd.startsWith(trimmed) && cmd !== trimmed)
    .sort();
}
