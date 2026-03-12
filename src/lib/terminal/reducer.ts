import type { CommandOutput, TerminalEntry, TerminalState, TerminalAction } from "./types";
import { parseCommand } from "./commands";

/** Create a terminal entry with a unique ID and timestamp */
function createEntry(output: CommandOutput, command?: string): TerminalEntry {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    command,
    output,
    timestamp: Date.now(),
  };
}

/** Initial terminal state with a welcome message */
export const initialState: TerminalState = {
  history: [createEntry({ type: "welcome" })],
  inputValue: "",
};

/**
 * Pure reducer for terminal state transitions.
 *
 * Handles:
 * - SUBMIT_COMMAND: parse input, append result (or clear if "clear" command)
 * - SET_INPUT: update current input value
 * - CLEAR: reset history to welcome-only state
 *
 * No side effects. No React imports. Resume download, scrolling, etc.
 * are handled by UI components.
 */
export function terminalReducer(
  state: TerminalState,
  action: TerminalAction
): TerminalState {
  switch (action.type) {
    case "SUBMIT_COMMAND": {
      const trimmed = action.command.trim();

      // Guard against empty submissions (Pitfall 3)
      if (trimmed.length === 0) {
        return state;
      }

      const output = parseCommand(trimmed);

      // Clear command: reset history to welcome-only
      if (output.type === "clear") {
        return {
          history: [createEntry({ type: "welcome" })],
          inputValue: "",
        };
      }

      // Normal command: append entry to history
      return {
        history: [...state.history, createEntry(output, trimmed)],
        inputValue: "",
      };
    }

    case "SET_INPUT":
      return {
        ...state,
        inputValue: action.value,
      };

    case "CLEAR":
      return {
        history: [createEntry({ type: "welcome" })],
        inputValue: "",
      };

    default:
      return state;
  }
}
