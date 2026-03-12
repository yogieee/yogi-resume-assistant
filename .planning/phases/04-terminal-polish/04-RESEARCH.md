# Phase 4: Terminal Polish - Research

**Researched:** 2026-03-12
**Domain:** Terminal UX polish (command history, autocomplete, typing animations, motion transitions)
**Confidence:** HIGH

## Summary

This phase adds four interaction layers to the existing terminal: command history navigation (arrow keys), autocomplete/suggestions (tab or chips), typing animation for responses, and smooth entry/exit transitions via the `motion` package. The codebase already has a clean separation between a pure logic layer (`src/lib/terminal/`) and React UI components, which makes adding these features straightforward -- each can be implemented as an extension to the existing reducer actions and input component.

The project already has `motion` v12.35.2 installed. All animation imports come from `"motion/react"` (NOT `"framer-motion"`). The typing animation will be hand-built using `useMotionValue` + `useTransform` + `animate` since Motion's built-in Typewriter component requires a paid Motion+ subscription.

**Primary recommendation:** Implement features in order: command history (pure state), autocomplete (state + UI), typing animation (motion values), then entry transitions (AnimatePresence). Each builds on the previous without blocking.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.35.2 | Entry/exit animations, typing effect | Already installed; `motion/react` is the successor to framer-motion |
| React (hooks) | 19.2.3 | State management, refs, effects | Already in use via useReducer pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none needed) | - | - | All features implementable with motion + React hooks |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| DIY typing animation | react-type-animation | Extra dependency for a simple effect; motion already installed |
| DIY autocomplete | cmdk or downshift | Overkill for ~11 known commands; adds bundle weight |
| Motion Typewriter | Built-in to motion | Requires Motion+ paid subscription; DIY is simple enough |

**Installation:**
```bash
# No new packages needed. motion is already installed.
```

## Architecture Patterns

### Recommended State Extensions

The existing `TerminalState` and `TerminalAction` types need extensions:

```
TerminalState additions:
  - commandHistory: string[]       # List of successfully submitted commands (not "clear")
  - historyIndex: number           # -1 = not browsing; 0+ = index from end
  - savedInput: string             # Preserves typed text when browsing history

TerminalAction additions:
  - HISTORY_UP                     # Arrow up - navigate backwards through history
  - HISTORY_DOWN                   # Arrow down - navigate forwards through history
```

### Recommended Project Structure
```
src/
  lib/terminal/
    reducer.ts          # Extended with history navigation actions
    commands.ts         # Existing - COMMANDS registry used for autocomplete
    types.ts            # Extended with new state fields and actions
  components/terminal/
    terminal-input.tsx  # Extended with onKeyDown for arrow keys + tab
    terminal-shell.tsx  # Extended with AnimatePresence wrapper
    terminal-output.tsx # Extended with motion.div wrappers
    typing-effect.tsx   # NEW: reusable typing animation component
    autocomplete.tsx    # NEW: suggestion chips / dropdown component
```

### Pattern 1: Command History via Reducer (Pure Logic)
**What:** Arrow up/down cycles through previously submitted commands.
**When to use:** Always -- this is a core terminal UX expectation.
**Example:**
```typescript
// In reducer.ts - pure logic, no React
case "HISTORY_UP": {
  if (state.commandHistory.length === 0) return state;
  const newIndex = state.historyIndex === -1
    ? state.commandHistory.length - 1
    : Math.max(0, state.historyIndex - 1);
  return {
    ...state,
    historyIndex: newIndex,
    // Save current input only when first entering history mode
    savedInput: state.historyIndex === -1 ? state.inputValue : state.savedInput,
    inputValue: state.commandHistory[newIndex],
  };
}

case "HISTORY_DOWN": {
  if (state.historyIndex === -1) return state;
  const newIndex = state.historyIndex + 1;
  if (newIndex >= state.commandHistory.length) {
    // Exited history mode - restore saved input
    return { ...state, historyIndex: -1, inputValue: state.savedInput };
  }
  return { ...state, historyIndex: newIndex, inputValue: state.commandHistory[newIndex] };
}
```

### Pattern 2: Typing Animation with Motion Values
**What:** Terminal responses appear character by character, skippable on click.
**When to use:** For text-heavy output entries.
**Example:**
```typescript
// typing-effect.tsx
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState, useCallback } from "react";

interface TypingEffectProps {
  children: string;
  speed?: number; // chars per second, default ~40
  onComplete?: () => void;
}

export function TypingEffect({ children, speed = 40, onComplete }: TypingEffectProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => children.slice(0, latest));
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = children.length / speed;
    const controls = animate(count, children.length, {
      type: "tween",
      duration,
      ease: "linear",
      onComplete: () => { setDone(true); onComplete?.(); },
    });
    return controls.stop;
  }, [children, speed]);

  const skip = useCallback(() => {
    count.set(children.length);
    setDone(true);
    onComplete?.();
  }, [children, count, onComplete]);

  return (
    <span onClick={skip} className={done ? undefined : "cursor-pointer"}>
      <motion.span>{displayText}</motion.span>
      {!done && <span className="animate-pulse">|</span>}
    </span>
  );
}
```

### Pattern 3: Entry Animations with AnimatePresence
**What:** New terminal output entries fade/slide in when added.
**When to use:** Wrapping the output list in terminal-shell.tsx.
**Example:**
```typescript
import { motion, AnimatePresence } from "motion/react";

// In TerminalShell, wrap the history map:
<AnimatePresence mode="popLayout">
  {state.history.map((entry) => (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <TerminalOutputEntry entry={entry} />
    </motion.div>
  ))}
</AnimatePresence>
```

### Pattern 4: Autocomplete / Suggestion Chips
**What:** Tab key or partial typing shows matching commands.
**When to use:** When input has partial text matching command names.
**Example:**
```typescript
// Filtering logic (pure function, can live in commands.ts):
export function getCompletions(input: string): CommandName[] {
  if (!input) return [];
  const lower = input.toLowerCase();
  return (Object.keys(COMMANDS) as CommandName[])
    .filter((cmd) => cmd.startsWith(lower) && cmd !== lower);
}

// Tab behavior in terminal-input.tsx onKeyDown:
if (e.key === "Tab") {
  e.preventDefault();
  const matches = getCompletions(value);
  if (matches.length === 1) {
    onChange(matches[0]); // Auto-complete single match
  } else if (matches.length > 1) {
    setSuggestions(matches); // Show suggestion chips
  }
}
```

### Anti-Patterns to Avoid
- **Re-rendering on every motion value update:** Use `useMotionValue` + `useTransform` to avoid React re-renders during the typing animation. Do NOT use `useState` for character count.
- **Animating removed DOM nodes without AnimatePresence:** The `exit` prop only works inside `<AnimatePresence>`. Without it, elements disappear instantly.
- **Blocking input during animation:** Never disable the input while a typing animation plays. The user should always be able to type the next command.
- **Storing history index in a ref instead of state:** It needs to be in the reducer state so `inputValue` stays in sync. A ref would cause the displayed value to desync.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Entry/exit animations | Manual CSS keyframe management | `motion.div` + `AnimatePresence` from `motion/react` | Handles mount/unmount lifecycle, spring physics, layout shifts |
| Typing character reveal | `setInterval` + `useState` counter | `useMotionValue` + `useTransform` + `animate` | Avoids React re-render per character; cleaner cleanup; skippable via `.set()` |
| Staggered list entry | Manual delay calculation | `stagger()` from `motion/react` with variants | Handles timing math, supports `from` direction option |

**Key insight:** The `motion` package already handles the hard parts (mount/unmount animation lifecycle, spring physics, GPU-accelerated transforms). The typing effect is the only piece that needs custom wiring, and even that uses motion primitives.

## Common Pitfalls

### Pitfall 1: AnimatePresence Requires Unique Stable Keys
**What goes wrong:** Animations break or elements flash when keys are unstable (e.g., array index).
**Why it happens:** AnimatePresence tracks children by key to determine enter/exit.
**How to avoid:** The existing `entry.id` (timestamp + random) is already unique and stable. Keep using it.
**Warning signs:** Elements re-mounting instead of animating, or exit animations not playing.

### Pitfall 2: History Navigation Resets on Any Input Change
**What goes wrong:** User presses arrow up, then types a character, and loses their history position unexpectedly.
**Why it happens:** `SET_INPUT` action doesn't reset `historyIndex`.
**How to avoid:** In the `SET_INPUT` case, reset `historyIndex` to `-1` whenever the user manually types (as opposed to arrow-key navigation setting the input). This means arrow key handlers should dispatch `HISTORY_UP`/`HISTORY_DOWN` (which set inputValue), NOT `SET_INPUT`.
**Warning signs:** History index and displayed input getting out of sync.

### Pitfall 3: Tab Key Moves Focus Out of Terminal
**What goes wrong:** Pressing Tab to autocomplete moves browser focus to the next focusable element.
**Why it happens:** Default browser Tab behavior.
**How to avoid:** Call `e.preventDefault()` in the `onKeyDown` handler when Tab is pressed.
**Warning signs:** Input loses focus on Tab press.

### Pitfall 4: Typing Animation on Complex JSX (Not Plain Text)
**What goes wrong:** Trying to apply character-by-character reveal to JSX elements (tables, lists) produces broken rendering.
**Why it happens:** `text.slice(0, n)` only works on strings, not React elements.
**How to avoid:** Use typing animation ONLY for simple text outputs. For complex outputs (help table, skills grid), use fade/slide entry animation instead. Alternatively, animate line-by-line with stagger rather than character-by-character.
**Warning signs:** Garbled HTML, broken layout during animation.

### Pitfall 5: Duplicate Commands in History
**What goes wrong:** Pressing the same command 5 times creates 5 identical history entries.
**Why it happens:** Naive push-to-array on every submit.
**How to avoid:** Either deduplicate consecutive duplicates (bash-style) or accept all entries (also valid). Recommend: skip consecutive duplicates (if last entry === new command, don't push).
**Warning signs:** Tedious arrow-key cycling through identical entries.

### Pitfall 6: Import Path Must Be "motion/react" Not "framer-motion"
**What goes wrong:** Build errors or stale API if importing from wrong package.
**Why it happens:** The project uses the `motion` package, not `framer-motion`.
**How to avoid:** Always `import { motion, AnimatePresence } from "motion/react"`.
**Warning signs:** Module not found errors, or importing deprecated APIs.

## Code Examples

### Complete Import Statement
```typescript
// Source: motion.dev official docs + GitHub README
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  stagger,
} from "motion/react";
```

### Fade+Slide Entry Animation for Output Entries
```typescript
// Source: motion.dev AnimatePresence docs
<motion.div
  key={entry.id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
>
  <TerminalOutputEntry entry={entry} />
</motion.div>
```

### Staggered Children (for multi-line outputs)
```typescript
// Source: motion.dev stagger docs
import { stagger } from "motion/react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.05),
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0 },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Arrow Key Handler in Input Component
```typescript
// In terminal-input.tsx onKeyDown handler
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  switch (e.key) {
    case "ArrowUp":
      e.preventDefault(); // Prevent cursor moving to start of input
      onHistoryUp();
      break;
    case "ArrowDown":
      e.preventDefault();
      onHistoryDown();
      break;
    case "Tab":
      e.preventDefault(); // Prevent focus change
      onTabComplete();
      break;
  }
};
```

### Suggestion Chips UI
```typescript
// Simple inline chips below the input or above it
<div className="flex flex-wrap gap-1 px-4 pb-2">
  {suggestions.map((cmd) => (
    <button
      key={cmd}
      onClick={() => onSelectSuggestion(cmd)}
      className="px-2 py-0.5 text-xs rounded bg-console-surface border border-console-border text-glow-green hover:bg-console-border transition-colors"
    >
      {cmd}
    </button>
  ))}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import from "framer-motion"` | `import from "motion/react"` | motion v11+ (2024) | Package renamed; framer-motion still works but motion is canonical |
| `variants` with `staggerChildren` number | `stagger()` function from "motion/react" | motion v11+ | More flexible; supports `from`, `startDelay` options |
| `useAnimation` for imperative control | `animate()` function | motion v10+ | Simpler API, works outside components |

**Deprecated/outdated:**
- `framer-motion` package name: Still installable but `motion` is the current name
- `staggerChildren: 0.1` in transition objects: Replaced by `stagger(0.1)` function

## Open Questions

1. **Typing animation for JSX-heavy outputs**
   - What we know: Character-by-character only works on plain strings. Most terminal outputs are complex JSX (tables, lists, styled spans).
   - What's unclear: Whether to apply typing only to simple text outputs (about, error) or find a line-by-line approach for complex ones.
   - Recommendation: Use typing animation for simple text responses only. Use fade+stagger for complex outputs. This keeps implementation simple and avoids broken rendering.

2. **Suggestion chips vs inline tab-completion**
   - What we know: Both patterns work. Chips are more discoverable; inline completion is more terminal-authentic.
   - What's unclear: Which UX the project prefers.
   - Recommendation: Implement BOTH -- Tab completes single match inline, shows chips for multiple matches. Best of both worlds.

3. **Should "clear" command be stored in history?**
   - What we know: Real terminals typically do store "clear" in history.
   - What's unclear: Whether this terminal should follow that convention.
   - Recommendation: Store it. Users expect arrow-up after "clear" to recall "clear".

## Sources

### Primary (HIGH confidence)
- motion GitHub README (raw.githubusercontent.com) - Import syntax `import { motion } from "motion/react"`
- motion.dev/docs/react-animate-presence - AnimatePresence API, mode prop, key requirements
- motion.dev/docs/stagger - stagger() function API and usage with variants
- motion.dev/docs/react-motion-value - useMotionValue, useTransform APIs

### Secondary (MEDIUM confidence)
- [LogRocket: Creating React animations with Motion](https://blog.logrocket.com/creating-react-animations-with-motion/) - Comprehensive code examples with motion/react imports
- [TarasCodes: Typing animation with Framer Motion](https://www.tarascodes.com/typing-animation-framer-motion-react) - useMotionValue + useTransform typing pattern (verified import path differs: use "motion/react" not "framer-motion")
- [Medium: Staggered animations with Framer Motion](https://medium.com/@onifkay/creating-staggered-animations-with-framer-motion-0e7dc90eae33) - Variants + stagger pattern

### Tertiary (LOW confidence)
- Community patterns for terminal history navigation (common knowledge, no single authoritative source)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - motion already installed, APIs verified via official docs and GitHub
- Architecture: HIGH - Existing codebase patterns are clear; extensions are straightforward
- Typing animation: MEDIUM - Pattern verified but import path was from framer-motion article; adapted to motion/react
- Pitfalls: HIGH - Based on well-known React and motion patterns

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (motion v12 is stable; no major changes expected)
