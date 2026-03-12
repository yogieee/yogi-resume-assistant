// Terminal logic layer types - pure TypeScript, no React dependencies

/** Discriminated union for all command output types */
export type CommandOutput =
  | { type: "welcome" }
  | { type: "help" }
  | { type: "about" }
  | { type: "skills" }
  | { type: "experience" }
  | { type: "projects" }
  | { type: "architecture" }
  | { type: "achievements" }
  | { type: "certifications" }
  | { type: "contact" }
  | { type: "hire" }
  | { type: "resume" }
  | { type: "clear" }
  | { type: "easter-egg"; egg: string }
  | { type: "error"; input: string };

/** A single entry in the terminal history */
export interface TerminalEntry {
  id: string;
  /** The raw command string typed by the user. Undefined for welcome message. */
  command?: string;
  output: CommandOutput;
  timestamp: number;
}

/** Terminal state managed by useReducer */
export interface TerminalState {
  history: TerminalEntry[];
  inputValue: string;
  /** Previously submitted commands (oldest first) */
  commandHistory: string[];
  /** Current position in commandHistory (-1 = not browsing) */
  historyIndex: number;
  /** Preserves typed text when entering history browsing mode */
  savedInput: string;
}

/** Actions dispatched to the terminal reducer */
export type TerminalAction =
  | { type: "SUBMIT_COMMAND"; command: string }
  | { type: "SET_INPUT"; value: string }
  | { type: "CLEAR" }
  | { type: "HISTORY_UP" }
  | { type: "HISTORY_DOWN" };
