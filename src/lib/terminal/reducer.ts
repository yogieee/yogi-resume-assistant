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
  history: [createEntry({ type: "welcome" }, "welcome")],
  inputValue: "",
  commandHistory: [],
  historyIndex: -1,
  savedInput: "",
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

      // Consecutive dedup: only store if different from last entry
      const lastCmd = state.commandHistory[state.commandHistory.length - 1];
      const newCommandHistory =
        lastCmd === trimmed
          ? state.commandHistory
          : [...state.commandHistory, trimmed];

      // Clear command: reset history to welcome-only
      if (output.type === "clear") {
        return {
          history: [createEntry({ type: "welcome" })],
          inputValue: "",
          commandHistory: newCommandHistory,
          historyIndex: -1,
          savedInput: "",
        };
      }

      // Normal command: append entry to history
      return {
        history: [...state.history, createEntry(output, trimmed)],
        inputValue: "",
        commandHistory: newCommandHistory,
        historyIndex: -1,
        savedInput: "",
      };
    }

    case "SET_INPUT":
      return {
        ...state,
        inputValue: action.value,
        historyIndex: -1,
      };

    case "CLEAR":
      return {
        history: [createEntry({ type: "welcome" })],
        inputValue: "",
        commandHistory: state.commandHistory,
        historyIndex: -1,
        savedInput: "",
      };

    case "HISTORY_UP": {
      if (state.commandHistory.length === 0) return state;

      // First press: save current input and jump to most recent command
      if (state.historyIndex === -1) {
        const newIndex = state.commandHistory.length - 1;
        return {
          ...state,
          savedInput: state.inputValue,
          historyIndex: newIndex,
          inputValue: state.commandHistory[newIndex],
        };
      }

      // Already browsing: go further back (min 0)
      const newIndex = Math.max(0, state.historyIndex - 1);
      return {
        ...state,
        historyIndex: newIndex,
        inputValue: state.commandHistory[newIndex],
      };
    }

    case "HISTORY_DOWN": {
      if (state.historyIndex === -1) return state;

      const newIndex = state.historyIndex + 1;

      // Past the end: restore saved input
      if (newIndex >= state.commandHistory.length) {
        return {
          ...state,
          historyIndex: -1,
          inputValue: state.savedInput,
        };
      }

      return {
        ...state,
        historyIndex: newIndex,
        inputValue: state.commandHistory[newIndex],
      };
    }

    default:
      return state;
  }
}
