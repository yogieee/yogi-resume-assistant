# Phase 3: Terminal Core - Research

**Researched:** 2026-03-12
**Domain:** React terminal emulator UI, command parsing, state management with useReducer
**Confidence:** HIGH

## Summary

This phase builds a custom terminal emulator component in React that serves as the primary interaction model for the portfolio. The terminal accepts 11 commands and renders formatted output sourced from the shared `portfolio` data file. No external terminal emulator libraries are needed -- the scope is narrow enough (fixed command set, no shell emulation, no PTY) that a custom `useReducer`-based component is the correct approach.

The architecture follows three clean layers: (1) a shell UI component handling input, output display, and auto-scroll, (2) a command registry/parser that maps string input to typed command results using discriminated unions, and (3) per-command output renderers that format portfolio data with colored labels and structured sections.

**Primary recommendation:** Build a custom terminal with `useReducer` for state, discriminated union types for command output, and individual renderer components per command type. No external terminal libraries.

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 19 | 19.2.3 | Component framework | Already in project |
| TypeScript 5 | ^5 | Type safety, discriminated unions | Already in project |
| Tailwind v4 | ^4 | Styling (console theme already defined) | Already in project |
| motion | ^12.35.2 | Entry animations for output blocks | Already in project |

### Supporting (No New Dependencies Needed)
This phase requires **zero new npm dependencies**. Everything is built with React primitives (`useReducer`, `useRef`, `useEffect`, `useCallback`) and the existing Tailwind theme tokens.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom terminal | xterm.js | Massive overkill -- xterm.js is a full terminal emulator with PTY support; we have 11 fixed commands |
| Custom terminal | react-terminal-ui | Adds dependency for something trivially buildable; limits styling control |
| useReducer | useState | useState would require multiple state variables and complex update logic; useReducer centralizes terminal state transitions |
| Discriminated unions | String-based types | Lose type narrowing, autocomplete, exhaustiveness checking |

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── terminal/
│       ├── terminal-shell.tsx       # Main shell: header, output area, input
│       ├── terminal-input.tsx       # Input line with prompt and cursor
│       ├── terminal-output.tsx      # Output entry renderer (dispatches to specific renderers)
│       └── renderers/
│           ├── help-output.tsx      # help command renderer
│           ├── about-output.tsx     # about command renderer
│           ├── skills-output.tsx    # skills command renderer
│           ├── experience-output.tsx
│           ├── projects-output.tsx
│           ├── architecture-output.tsx
│           ├── achievements-output.tsx
│           ├── certifications-output.tsx
│           ├── contact-output.tsx
│           ├── error-output.tsx     # unknown command renderer
│           └── welcome-output.tsx   # welcome message renderer
├── lib/
│   └── terminal/
│       ├── commands.ts             # Command registry and parser
│       ├── types.ts                # Discriminated union types
│       └── reducer.ts             # Terminal state reducer
```

### Pattern 1: Terminal State Reducer
**What:** Centralized state management for terminal history and input
**When to use:** Always -- this is the core state pattern for the terminal

```typescript
// src/lib/terminal/types.ts

// Discriminated union for all command output types
type CommandOutput =
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
  | { type: "resume" }
  | { type: "error"; input: string }

interface TerminalEntry {
  id: string
  command?: string       // undefined for welcome message
  output: CommandOutput
  timestamp: number
}

interface TerminalState {
  history: TerminalEntry[]
  inputValue: string
}

// Action union
type TerminalAction =
  | { type: "SUBMIT_COMMAND"; command: string }
  | { type: "SET_INPUT"; value: string }
  | { type: "CLEAR" }
```

**Why discriminated unions:** TypeScript narrows `output.type` in switch statements, giving exhaustiveness checking and per-type autocompletion. Each renderer only receives its specific variant.

### Pattern 2: Command Registry
**What:** Map from command string to output type, with parsing logic
**When to use:** Decouples input parsing from rendering

```typescript
// src/lib/terminal/commands.ts

const COMMANDS = {
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
} as const satisfies Record<string, { description: string }>

type CommandName = keyof typeof COMMANDS

function parseCommand(input: string): CommandOutput {
  const trimmed = input.trim().toLowerCase()
  if (trimmed in COMMANDS) {
    return { type: trimmed as CommandName }
  }
  return { type: "error", input: trimmed }
}
```

**Key detail:** Use `as const satisfies` pattern (matching project convention from `portfolio.ts`) for the command registry. This preserves literal types while ensuring structural correctness.

### Pattern 3: Auto-Scroll with Ref
**What:** Scroll to bottom when new output appears
**When to use:** Every time history changes

```typescript
const outputEndRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  outputEndRef.current?.scrollIntoView({ behavior: "smooth" })
}, [state.history.length])

// In JSX:
// <div ref={outputEndRef} /> at bottom of output area
```

### Pattern 4: Resume Download via Anchor
**What:** Trigger PDF download without navigation
**When to use:** When `resume` command is executed

```typescript
// In the reducer or effect handler for resume command:
function downloadResume() {
  const link = document.createElement("a")
  link.href = "/resume.pdf"  // File in public/
  link.download = "Yoganand_Govind_Resume.pdf"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

### Anti-Patterns to Avoid
- **Hardcoding portfolio data in renderers:** All data must come from `portfolio` import -- renderers receive data as props or import from `@/data/portfolio`
- **String-based output type checking:** Use discriminated unions, not `if (type === "help")` with string literals scattered everywhere
- **Single monolithic component:** Split shell, input, output, and individual renderers into separate components
- **Using `dangerouslySetInnerHTML` for formatted output:** Build React components with proper Tailwind classes instead
- **Storing input value in the reducer:** Input value CAN be in reducer for simplicity, but could also be local `useState` in the input component -- either is fine, but pick one pattern and be consistent

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Unique IDs for history entries | UUID library | `crypto.randomUUID()` or `Date.now().toString(36)` | Browser-native, no dependency needed |
| Entry animations | Custom CSS keyframes | `motion` package `AnimatePresence` + `motion.div` | Already installed, handles mount/unmount animations |
| Blinking cursor | JavaScript interval toggle | CSS `@keyframes` with `step-end` timing | Pure CSS is more performant, no React re-renders |
| Scrollbar styling | Custom scroll component | Existing CSS in `globals.css` | Already styled with console aesthetic |
| Color tokens | Inline hex values | Existing Tailwind theme (`text-glow-green`, `bg-console-surface`, etc.) | Consistency with existing design system |

**Key insight:** The project already has a complete console color palette defined in `globals.css`. The terminal should use these tokens exclusively -- `text-glow-green` for accents, `text-console-text-dim` for secondary text, `bg-console-surface` for backgrounds, `border-console-border` for borders.

## Common Pitfalls

### Pitfall 1: Focus Management
**What goes wrong:** User clicks elsewhere, then can't type without clicking the input again
**Why it happens:** Default `<input>` loses focus on click outside
**How to avoid:** Auto-focus on mount. Re-focus when clicking anywhere in the terminal area. Use a click handler on the terminal container that calls `inputRef.current?.focus()`
**Warning signs:** Manual testing reveals you have to click precisely on the input to type

### Pitfall 2: Scroll Position on Clear
**What goes wrong:** After `clear`, the terminal doesn't reset scroll position
**Why it happens:** The `clear` action empties history but doesn't reset scroll
**How to avoid:** In the `clear` handler, also scroll to top (or the new welcome message position)
**Warning signs:** Empty terminal with scroll offset after clearing

### Pitfall 3: Input Submission on Empty String
**What goes wrong:** Pressing Enter with empty input creates empty history entries
**Why it happens:** No guard in the submit handler
**How to avoid:** Check `trimmed.length > 0` before dispatching
**Warning signs:** Blank command entries in the history

### Pitfall 4: Key Event Handling
**What goes wrong:** Form submission causes page reload
**Why it happens:** Default form behavior on Enter
**How to avoid:** Use `onSubmit` with `e.preventDefault()` on a `<form>` wrapper, or handle `onKeyDown` for Enter key with `e.preventDefault()`
**Warning signs:** Page refreshes when pressing Enter

### Pitfall 5: Output Renderer Not Exhaustive
**What goes wrong:** Adding a new command type doesn't produce a TypeScript error
**Why it happens:** Switch statement lacks exhaustiveness check
**How to avoid:** Add a `default: never` exhaustiveness check in the output renderer switch:
```typescript
function assertNever(x: never): never {
  throw new Error(`Unexpected output type: ${x}`)
}
// In switch default: return assertNever(output)
```
**Warning signs:** Silent failures when adding new command types

### Pitfall 6: ASCII Art Line Breaking
**What goes wrong:** ASCII architecture diagram wraps incorrectly on smaller screens
**Why it happens:** Default text wrapping breaks ASCII art alignment
**How to avoid:** Use `whitespace-pre` or `whitespace-pre-wrap` with `overflow-x-auto` on ASCII output blocks. Use a monospace font (already `font-mono` globally).
**Warning signs:** Mangled diagrams on narrow viewports

## Code Examples

### Terminal Shell Component Structure
```typescript
// src/components/terminal/terminal-shell.tsx
"use client"

import { useReducer, useRef, useEffect, useCallback } from "react"
import { terminalReducer, initialState } from "@/lib/terminal/reducer"
import { TerminalInput } from "./terminal-input"
import { TerminalOutput } from "./terminal-output"

export function TerminalShell() {
  const [state, dispatch] = useReducer(terminalReducer, initialState)
  const outputEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll on new output
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [state.history.length])

  // Focus input when clicking terminal area
  const handleContainerClick = useCallback(() => {
    // TerminalInput exposes focus via imperative handle or we find the input
    containerRef.current?.querySelector("input")?.focus()
  }, [])

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="flex flex-col h-full bg-console-bg font-mono"
    >
      {/* Header */}
      <div className="shrink-0 px-4 py-2 border-b border-console-border bg-console-surface">
        <span className="text-glow-green text-sm">Yogi Dev Console v1.0</span>
      </div>

      {/* Scrollable output area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.history.map((entry) => (
          <TerminalOutput key={entry.id} entry={entry} />
        ))}
        <div ref={outputEndRef} />
      </div>

      {/* Input */}
      <TerminalInput
        value={state.inputValue}
        onChange={(v) => dispatch({ type: "SET_INPUT", value: v })}
        onSubmit={(cmd) => dispatch({ type: "SUBMIT_COMMAND", command: cmd })}
      />
    </div>
  )
}
```

### Blinking Cursor CSS (Tailwind v4)
```css
/* In globals.css, @layer utilities */
.cursor-blink::after {
  content: "█";
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

Or using Tailwind's `@theme` block to define the animation and use `animate-blink` utility.

### Discriminated Union Output Renderer
```typescript
// src/components/terminal/terminal-output.tsx
import type { TerminalEntry } from "@/lib/terminal/types"
import { HelpOutput } from "./renderers/help-output"
import { AboutOutput } from "./renderers/about-output"
// ... other renderer imports

function assertNever(x: never): never {
  throw new Error(`Unhandled output type: ${JSON.stringify(x)}`)
}

export function TerminalOutput({ entry }: { entry: TerminalEntry }) {
  return (
    <div>
      {/* Echo the command */}
      {entry.command && (
        <div className="text-console-text-dim">
          <span className="text-glow-green">{">"}</span> {entry.command}
        </div>
      )}

      {/* Render output by type */}
      {renderOutput(entry.output)}
    </div>
  )
}

function renderOutput(output: CommandOutput) {
  switch (output.type) {
    case "welcome": return <WelcomeOutput />
    case "help": return <HelpOutput />
    case "about": return <AboutOutput />
    case "skills": return <SkillsOutput />
    case "experience": return <ExperienceOutput />
    case "projects": return <ProjectsOutput />
    case "architecture": return <ArchitectureOutput />
    case "achievements": return <AchievementsOutput />
    case "certifications": return <CertificationsOutput />
    case "contact": return <ContactOutput />
    case "resume": return <ResumeOutput />
    case "error": return <ErrorOutput input={output.input} />
    default: return assertNever(output)
  }
}
```

### Formatted Output Pattern (Example: Skills)
```typescript
// src/components/terminal/renderers/skills-output.tsx
import { portfolio } from "@/data/portfolio"

export function SkillsOutput() {
  return (
    <div className="space-y-3 mt-2">
      <div className="text-glow-green font-bold">Technical Skills</div>
      {portfolio.skills.map((category) => (
        <div key={category.category}>
          <span className="text-glow-cyan">{category.category}:</span>
          <span className="text-console-text ml-2">
            {category.skills.map((s) => s.name).join(" · ")}
          </span>
        </div>
      ))}
    </div>
  )
}
```

### Clickable Links Pattern (Contact Output)
```typescript
// src/components/terminal/renderers/contact-output.tsx
import { portfolio } from "@/data/portfolio"

export function ContactOutput() {
  return (
    <div className="space-y-2 mt-2">
      <div className="text-glow-green font-bold">Contact Information</div>
      {portfolio.contact.map((item) => (
        <div key={item.type} className="flex gap-2">
          <span className="text-glow-cyan w-20">{item.label}:</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-glow-amber hover:underline"
          >
            {item.value}
          </a>
        </div>
      ))}
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| xterm.js for custom terminals | Custom React components | N/A | xterm.js only needed for real shell emulation |
| `useState` for complex state | `useReducer` with typed actions | React best practice | Cleaner state transitions, better TypeScript support |
| `framer-motion` package | `motion` package | v11+ rebranding | Import from `motion/react` not `framer-motion` |
| `className` animation strings | `motion.div` with `AnimatePresence` | Current | Handles mount animations declaratively |

**Note on motion imports:** The project uses `motion` v12.35.2. Imports should be from `"motion/react"` not `"framer-motion"`.

## Open Questions

1. **Resume PDF file location**
   - What we know: PDF download needs a file in `public/`
   - What's unclear: Whether `resume.pdf` already exists in `public/`
   - Recommendation: Plan a task to ensure `public/resume.pdf` exists, or use a placeholder

2. **Architecture command ASCII art content**
   - What we know: OUT-06 requires an ASCII architecture diagram
   - What's unclear: What system/architecture to depict (personal infrastructure? Autowire.ai?)
   - Recommendation: Use the `architecture` field from `portfolio.projects[0]` and format as ASCII flow diagram

3. **Motion animations for output blocks**
   - What we know: `motion` is installed and works
   - What's unclear: Whether heavy animation on every output block would feel sluggish
   - Recommendation: Use subtle `motion.div` fade-in with short duration (200ms) for output blocks; skip animation for `clear`

4. **Mobile responsiveness of terminal**
   - What we know: Page uses `lg:grid-cols-[600px_1fr]` layout
   - What's unclear: How terminal input works on mobile (virtual keyboard concerns)
   - Recommendation: Defer mobile optimization to a later phase; focus on desktop-first terminal UX

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/types/portfolio.ts`, `src/data/portfolio.ts`, `src/app/globals.css` -- verified all data types and theme tokens
- React official docs: `useReducer` API and patterns -- [react.dev/reference/react/useReducer](https://react.dev/reference/react/useReducer)

### Secondary (MEDIUM confidence)
- [Kent C. Dodds - State Reducer Pattern](https://kentcdodds.com/blog/the-state-reducer-pattern-with-react-hooks) -- useReducer patterns
- [Motion Typewriter docs](https://motion.dev/docs/react-typewriter) -- motion package capabilities (page did not fully load)
- [Dev.to - useReducer with TypeScript](https://dev.to/craigaholliday/using-the-usereducer-hook-in-react-with-typescript-27m1) -- TypeScript typing patterns
- [Convex TypeScript Guide - Discriminated Unions](https://www.convex.dev/typescript/advanced/type-operators-manipulation/typescript-discriminated-union) -- discriminated union patterns
- [Next.js Discussion #25981](https://github.com/vercel/next.js/discussions/25981) -- PDF download from public folder
- [Dave Lage - Chat scroll React](https://davelage.com/posts/chat-scroll-react/) -- auto-scroll patterns

### Tertiary (LOW confidence)
- [Amit Merchant - CSS blinking cursor](https://www.amitmerchant.com/simple-blinking-cursor-animation-using-css/) -- cursor animation technique

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, uses existing React primitives and project theme
- Architecture: HIGH -- useReducer + discriminated unions is a well-established pattern for this exact use case
- Pitfalls: HIGH -- based on common React patterns and verified against existing codebase structure
- Code examples: MEDIUM -- patterns are standard but not tested against this specific project setup

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (stable domain, no fast-moving dependencies)
