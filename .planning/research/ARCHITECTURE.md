# Architecture Research

**Domain:** AI-powered developer portfolio terminal
**Researched:** 2026-03-11
**Confidence:** HIGH (Next.js App Router patterns verified via official docs; terminal UI and AI SDK patterns from training data -- MEDIUM confidence on AI SDK specifics)

## Standard Architecture

### System Overview

```
+------------------------------------------------------------------+
|                     Next.js App Router                            |
|                                                                   |
|  app/layout.tsx (Root Layout - fonts, theme, metadata)            |
|  app/page.tsx   (Single-page app - renders both panels)           |
|                                                                   |
|  +---------------------------+  +------------------------------+  |
|  |   LEFT PANEL              |  |   RIGHT PANEL                |  |
|  |                           |  |                              |  |
|  |   <ProfileCard />         |  |   <Terminal />               |  |
|  |   - Avatar                |  |   - TerminalHeader           |  |
|  |   - Name/Role/Tagline     |  |   - CommandHistory (output)  |  |
|  |   - Social links          |  |   - CommandInput (prompt)    |  |
|  |   - Resume download       |  |                              |  |
|  |                           |  |   State: mode (terminal|ai)  |  |
|  |   (Server Component       |  |   State: history[]           |  |
|  |    with static data)      |  |   State: isTyping            |  |
|  +---------------------------+  +------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
                                    |
                          (AI Mode only)
                                    |
                                    v
                    +-------------------------------+
                    |  app/api/chat/route.ts        |
                    |  POST handler                 |
                    |  - Receives user question     |
                    |  - Builds system prompt with  |
                    |    portfolio context           |
                    |  - Calls Claude API            |
                    |  - Streams response back       |
                    +-------------------------------+
                                    |
                                    v
                    +-------------------------------+
                    |  Anthropic Claude API          |
                    |  (via @ai-sdk/anthropic        |
                    |   or direct @anthropic-ai/sdk) |
                    +-------------------------------+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/layout.tsx` | Root layout: HTML shell, fonts (mono + sans), metadata, global styles | Server Component. Loads Inter + JetBrains Mono. Sets dark theme. |
| `app/page.tsx` | Page shell: two-panel grid layout, responsive breakpoints | Server Component. Renders `<ProfileCard />` and `<Terminal />` side by side. |
| `ProfileCard` | Displays developer identity: photo, name, role, tagline, social links, resume button | Can be Server Component (all static data). Glassmorphism card with Framer Motion float animation. |
| `Terminal` | Container for the terminal experience. Owns terminal state (history, mode, input). | Client Component (`"use client"`). This is the primary stateful component. |
| `TerminalHeader` | Visual chrome: title bar ("Yogi Dev Console v1.0"), traffic light dots, mode toggle | Presentational. Receives mode + onModeChange as props. |
| `CommandInput` | Input field with terminal prompt (`>`), handles submit, arrow key history navigation | Client Component. Manages local input state, emits commands upward to Terminal. |
| `CommandHistory` | Renders the scrollable list of past command/output pairs | Presentational. Maps over history array. Auto-scrolls to bottom via ref. |
| `CommandOutput` | Renders a single output block with typing animation | Client Component. Uses Framer Motion or react-type-animation for character-by-character reveal. |
| `CommandParser` | Pure function: maps command string to output data | Utility module (`lib/`). No React. Returns structured output objects. |
| `ModeToggle` | Switches between Terminal Mode and AI Mode | Part of TerminalHeader or standalone. Updates terminal mode state. |
| `TypingAnimation` | Animates text appearing character by character | Reusable hook or component wrapping Framer Motion `animate`. |

### Key Architectural Decision: Where State Lives

The Terminal component is the **single stateful hub** for the right panel. This is deliberate:

```
Terminal (state owner)
  |-- mode: "terminal" | "ai"
  |-- history: Array<{ command: string; output: ReactNode; timestamp: number }>
  |-- isProcessing: boolean
  |
  |-- TerminalHeader (reads mode, emits mode change)
  |-- CommandHistory (reads history)
  |     |-- CommandOutput (reads single entry, animates)
  |-- CommandInput (emits command string)
```

**Why single state owner:** Terminal interactions are sequential (one command at a time), history is append-only, and mode affects how commands are processed. Lifting state higher than Terminal adds complexity with no benefit. Pushing state lower fragments it unnecessarily.

**State management: React useState + useReducer.** No external state library needed. The state shape is simple (array of entries, a mode enum, a processing boolean). A reducer is cleaner than multiple useState calls because command processing involves multiple state transitions atomically.

## Recommended Project Structure

```
src/                              # or just root-level (Next.js supports both)
  app/
    layout.tsx                    # Root layout: fonts, metadata, theme
    page.tsx                      # Main page: two-panel grid
    globals.css                   # Tailwind base + custom terminal styles
    api/
      chat/
        route.ts                  # AI chat endpoint (POST, streaming)

  components/
    profile/
      ProfileCard.tsx             # Left panel: developer ID card
      SocialLinks.tsx             # GitHub, LinkedIn, Email icons
      ResumeButton.tsx            # Download resume CTA

    terminal/
      Terminal.tsx                # Right panel: stateful terminal container
      TerminalHeader.tsx          # Title bar with mode toggle
      CommandInput.tsx            # Input prompt with history navigation
      CommandHistory.tsx          # Scrollable output area
      CommandOutput.tsx           # Single command+response block
      TypingAnimation.tsx         # Character-by-character text reveal
      ModeToggle.tsx              # Terminal/AI mode switcher

    ui/                           # shadcn/ui components (Button, Badge, etc.)

  data/
    portfolio.ts                  # All portfolio content as typed constants
    commands.ts                   # Command definitions and metadata

  lib/
    command-parser.ts             # Maps command string -> output
    ai-context.ts                 # Builds system prompt with portfolio data
    utils.ts                      # cn() helper, misc utilities

  hooks/
    use-terminal.ts               # Terminal state reducer + command processing
    use-typing-animation.ts       # Typing effect timing logic
    use-auto-scroll.ts            # Auto-scroll to bottom of terminal
    use-command-history.ts        # Arrow key navigation through past commands

  styles/
    terminal.css                  # Terminal-specific custom styles (if needed beyond Tailwind)

  public/
    profile.jpg                   # Profile photo
    resume.pdf                    # Downloadable resume
```

### Why This Structure

**`data/` is separate from `lib/`:** Portfolio content changes frequently (adding projects, updating experience). Keeping it in pure data files means non-developers could update content without touching logic. The `portfolio.ts` file exports typed constants that both the CommandParser and AI context builder consume.

**`hooks/` extracts complexity from components:** The Terminal component would be 300+ lines if it contained all the state logic, animation timing, scroll behavior, and history navigation inline. Custom hooks keep the component readable while co-locating related logic.

**`lib/command-parser.ts` is a pure function, not a component:** Command parsing is testable logic with no UI concern. It takes a string, returns structured data. This separation enables unit testing without rendering components.

**No `services/` or `api/` client folder:** For a portfolio site with one API endpoint, a dedicated API client layer is over-engineering. The `useChat` hook (from Vercel AI SDK) or a simple `fetch` call in the terminal hook handles the AI endpoint directly.

## Architectural Patterns

### Pattern 1: Command Registry

Instead of a switch/case in the parser, use a command registry pattern. This makes commands self-documenting and extensible.

```typescript
// data/commands.ts
export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  category: "info" | "navigation" | "system";
  execute: () => CommandOutput;
}

export const commands: Record<string, Command> = {
  help: {
    name: "help",
    description: "Display available commands",
    category: "system",
    execute: () => ({
      type: "help",
      data: Object.values(commands).map(c => ({
        name: c.name,
        description: c.description,
      })),
    }),
  },
  about: {
    name: "about",
    description: "Display professional summary",
    category: "info",
    execute: () => ({
      type: "about",
      data: portfolio.about,
    }),
  },
  // ... more commands
};

// lib/command-parser.ts
export function parseCommand(input: string): CommandOutput {
  const trimmed = input.trim().toLowerCase();
  const command = commands[trimmed];

  if (!command) {
    return {
      type: "error",
      data: `Command not found: ${trimmed}. Type 'help' for available commands.`,
    };
  }

  return command.execute();
}
```

**Why:** Adding a new command means adding one object to the registry. The `help` command auto-generates from the registry. No parser changes needed.

### Pattern 2: Discriminated Union for Command Output

Use TypeScript discriminated unions for type-safe output rendering.

```typescript
// types/terminal.ts
type CommandOutput =
  | { type: "about"; data: AboutData }
  | { type: "skills"; data: SkillCategory[] }
  | { type: "experience"; data: Experience[] }
  | { type: "projects"; data: Project[] }
  | { type: "help"; data: HelpEntry[] }
  | { type: "error"; data: string }
  | { type: "clear" }
  | { type: "ai-response"; data: string };

// components/terminal/CommandOutput.tsx
function CommandOutput({ output }: { output: CommandOutput }) {
  switch (output.type) {
    case "about": return <AboutOutput data={output.data} />;
    case "skills": return <SkillsOutput data={output.data} />;
    case "experience": return <ExperienceOutput data={output.data} />;
    // TypeScript ensures exhaustive handling
  }
}
```

**Why:** Each command produces differently-shaped data. Discriminated unions let TypeScript verify you handle every command type, and each output component receives properly-typed props.

### Pattern 3: Terminal State Reducer

Use `useReducer` instead of multiple `useState` calls for terminal state.

```typescript
// hooks/use-terminal.ts
type TerminalState = {
  history: HistoryEntry[];
  mode: "terminal" | "ai";
  isProcessing: boolean;
  commandIndex: number; // for arrow key navigation
};

type TerminalAction =
  | { type: "EXECUTE_COMMAND"; command: string; output: CommandOutput }
  | { type: "SET_MODE"; mode: "terminal" | "ai" }
  | { type: "CLEAR" }
  | { type: "SET_PROCESSING"; value: boolean }
  | { type: "APPEND_AI_CHUNK"; chunk: string }
  | { type: "NAVIGATE_HISTORY"; direction: "up" | "down" };

function terminalReducer(state: TerminalState, action: TerminalAction): TerminalState {
  switch (action.type) {
    case "EXECUTE_COMMAND":
      return {
        ...state,
        history: [...state.history, { command: action.command, output: action.output }],
        commandIndex: state.history.length + 1,
      };
    case "CLEAR":
      return { ...state, history: [] };
    // ...
  }
}
```

**Why:** Terminal state transitions are interdependent (executing a command updates history AND resets command index AND may change processing state). A reducer handles this atomically rather than across 3+ setter calls that cause 3+ re-renders.

### Pattern 4: AI Mode with Streaming (Vercel AI SDK)

The standard pattern for AI chat in Next.js uses the Vercel AI SDK `useChat` hook on the client and a route handler on the server.

```typescript
// app/api/chat/route.ts
import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { portfolioContext } from "@/lib/ai-context";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: portfolioContext, // grounded with portfolio data
    messages,
  });

  return result.toDataStreamResponse();
}

// lib/ai-context.ts
import { portfolio } from "@/data/portfolio";

export const portfolioContext = `
You are an AI assistant for Yogananda Govind's developer portfolio.
Answer questions about his experience, skills, and projects based on the following data:

${JSON.stringify(portfolio, null, 2)}

Be concise and professional. If asked something not covered by the data, say so.
`;
```

**On the client side**, you can either use the Vercel AI SDK `useChat` hook directly or integrate streaming into the custom terminal reducer. The simpler approach for this project: use `useChat` when in AI mode, and the terminal reducer when in terminal mode.

**Why Vercel AI SDK:** It handles streaming, message state, loading states, and error handling out of the box. The `@ai-sdk/anthropic` provider connects directly to Claude. Since the project deploys on Vercel, this is the natural fit. The alternative (raw `fetch` with `ReadableStream`) works but requires manually handling stream parsing, which the SDK abstracts away.

## Data Flow

### Terminal Command Flow

```
User types command + Enter
        |
        v
CommandInput.onSubmit(inputValue)
        |
        v
Terminal.handleCommand(input)
        |
        v
    [mode check]
        |
   terminal mode ---------> ai mode
        |                       |
        v                       v
commandParser.parse(input)  POST /api/chat
        |                       |
        v                       v
CommandOutput (sync)        Stream chunks arrive
        |                       |
        v                       v
dispatch({ type:            dispatch({ type:
  "EXECUTE_COMMAND",          "APPEND_AI_CHUNK",
  output })                   chunk })
        |                       |
        v                       v
history updated             history updated incrementally
        |                       |
        v                       v
CommandHistory re-renders   CommandHistory re-renders
        |                       |     (per chunk)
        v                       v
auto-scroll to bottom       auto-scroll to bottom
```

### AI Chat Flow (Detail)

```
1. User enters question in AI mode
2. Terminal dispatches SET_PROCESSING(true)
3. POST request to /api/chat with:
   - messages: [{ role: "user", content: question }]
4. Route handler:
   a. Loads portfolio context as system prompt
   b. Calls Claude via @ai-sdk/anthropic
   c. Returns streaming response
5. Client receives chunks via ReadableStream
6. Each chunk: dispatch APPEND_AI_CHUNK
7. On completion: dispatch SET_PROCESSING(false)
8. CommandHistory displays complete response
```

### State Management

**No global state store needed.** The application has two independent UI regions:

| Region | State Source | Reactivity |
|--------|-------------|------------|
| ProfileCard (left) | Static data from `data/portfolio.ts` | None (server-rendered, no interactivity) |
| Terminal (right) | `useReducer` in Terminal component | Local to Terminal subtree |

**Cross-component communication:** None required. The left and right panels are independent. The profile card displays static information. The terminal manages its own state. There is no scenario where a terminal command needs to update the profile card or vice versa.

**Data source:** A single `data/portfolio.ts` file serves as the source of truth. It is imported by:
- `CommandParser` (to generate command outputs)
- `ai-context.ts` (to build the system prompt for Claude)
- `ProfileCard` (to render profile information)

This means updating portfolio content requires editing one file, and all consumers reflect the change.

## Anti-Patterns

### Anti-Pattern 1: Global State Store (Redux, Zustand, Jotai)

**What:** Installing a state management library for this application.
**Why bad:** The app has one stateful region (the terminal) with no cross-component state sharing needs. A global store adds dependency weight, boilerplate, and conceptual overhead for zero benefit. The terminal state is naturally co-located.
**Instead:** `useReducer` in the Terminal component. If you later need to share terminal state (unlikely), React Context is sufficient.

### Anti-Pattern 2: Server Components for the Terminal

**What:** Trying to make the Terminal or its children Server Components.
**Why bad:** The terminal requires extensive client-side interactivity: keystroke handling, focus management, animation, scroll control, streaming responses. Server Components cannot use hooks, event handlers, or browser APIs. You will immediately hit `"use client"` errors and end up converting everything anyway.
**Instead:** Make Terminal and all its children Client Components. The ProfileCard can remain a Server Component (or be a Client Component with no penalty since the page is single-route anyway). The `page.tsx` can be a Server Component that imports both.

### Anti-Pattern 3: Over-Componentizing Output Renderers

**What:** Creating 15+ output components (AboutOutput, SkillsOutput, ExperienceOutput, ProjectOutput, AchievementsOutput, CertificationsOutput, ContactOutput, ResumeOutput, HelpOutput, ErrorOutput, ClearOutput, AIOutput...).
**Why bad:** Most outputs share the same visual pattern: a title, some styled text blocks, maybe a list. Creating a component per command leads to massive duplication.
**Instead:** Create 3-4 generic output components (TextBlock, ListBlock, CardGrid, ErrorBlock) and have the command registry specify which output template to use. Only create custom components when the rendering is genuinely unique.

### Anti-Pattern 4: Polling Instead of Streaming for AI

**What:** Sending an AI question, waiting for the full response, then displaying it.
**Why bad:** Claude responses can take 2-10 seconds. With no streaming, the user stares at a loading spinner with no feedback. This feels broken for a terminal experience where users expect immediate character-by-character output.
**Instead:** Use streaming via the Vercel AI SDK. Characters appear as they are generated, matching the terminal typing aesthetic naturally.

### Anti-Pattern 5: Storing Portfolio Data in a Database

**What:** Setting up a CMS or database for portfolio content.
**Why bad:** For a single-person portfolio, the content is static and changes rarely. A database adds deployment complexity, runtime costs, and a failure point. The entire portfolio dataset fits in a single TypeScript file under 200 lines.
**Instead:** `data/portfolio.ts` with typed constants. Deploy as part of the build. For content updates, edit the file and redeploy (Vercel makes this trivial).

## Integration Points

### 1. Portfolio Data <-> Multiple Consumers

```
data/portfolio.ts
    |
    +---> components/profile/ProfileCard.tsx  (display)
    +---> lib/command-parser.ts               (command output)
    +---> lib/ai-context.ts                   (system prompt for Claude)
```

**Design implication:** The portfolio data types must be the single source of truth. Define TypeScript interfaces in a `types/` file or co-locate them in `data/portfolio.ts`. All consumers import the same typed constants.

### 2. Terminal <-> AI API

```
Terminal (client) --- POST /api/chat ---> Route Handler (server) ---> Claude API
                  <-- Streaming response ---
```

**Design implication:** The API route must handle:
- Rate limiting (prevent abuse of Claude API credits)
- Error handling (API key missing, quota exceeded, model errors)
- System prompt injection (portfolio context)
- Response streaming

**Environment variable:** `ANTHROPIC_API_KEY` set in Vercel environment variables. Never exposed to the client.

### 3. Framer Motion <-> Terminal Components

Framer Motion is used in two distinct ways:
- **ProfileCard:** Continuous floating/hover animation (CSS-animation-like, subtle)
- **Terminal outputs:** Enter animations for new command outputs (slide in, fade in)
- **Typing effect:** Can use Framer Motion `animate` or a simpler `setInterval` approach

**Design implication:** Keep animation definitions in the components that use them, not in a central animation config. Terminal and ProfileCard animations have nothing in common.

### 4. shadcn/ui Integration

shadcn/ui provides the component primitives (Button, Badge, Separator, etc.) but the terminal itself is fully custom. Do not try to build the terminal from shadcn/ui components -- they are designed for form-based UIs, not terminal emulation.

**Use shadcn/ui for:**
- Resume download button
- Social link buttons
- Badges for skills/tech tags
- Mode toggle (could use shadcn Switch or Tabs)

**Do NOT use shadcn/ui for:**
- Terminal input (needs custom monospace input with prompt)
- Terminal output area (needs custom scroll container)
- Command history (needs custom rendering)

## Build Order (Dependency Chain)

Components have natural dependencies. Build in this order to avoid rework:

```
Phase 1: Foundation (no dependencies)
  1. data/portfolio.ts          -- All content defined as typed constants
  2. types/                     -- TypeScript interfaces for portfolio, commands, terminal
  3. app/layout.tsx             -- Root layout with fonts and theme
  4. lib/utils.ts               -- cn() helper, basic utilities
  5. globals.css + tailwind     -- Theme variables, base styles

Phase 2: Static UI (depends on Phase 1)
  6. ProfileCard                -- Left panel (consumes portfolio data)
  7. app/page.tsx               -- Two-panel grid layout
  8. TerminalHeader             -- Visual chrome (no logic yet)

Phase 3: Terminal Core (depends on Phase 1 + 2)
  9. lib/command-parser.ts      -- Pure function, testable independently
  10. hooks/use-terminal.ts     -- State reducer
  11. CommandInput              -- Input with prompt character
  12. CommandOutput             -- Renders parsed output (start with simple text)
  13. CommandHistory            -- Scrollable output list
  14. Terminal                  -- Wires everything together

Phase 4: Polish (depends on Phase 3)
  15. Typing animation          -- Character-by-character reveal
  16. hooks/use-auto-scroll.ts  -- Auto-scroll on new output
  17. hooks/use-command-history  -- Arrow key navigation
  18. Framer Motion animations  -- Enter/exit transitions

Phase 5: AI Mode (depends on Phase 3)
  19. lib/ai-context.ts         -- System prompt builder
  20. app/api/chat/route.ts     -- API endpoint
  21. AI mode in Terminal        -- Toggle + streaming integration
  22. Rate limiting              -- Protect API costs

Phase 6: Responsive + Final
  23. Mobile layout             -- Stack panels vertically
  24. SEO metadata              -- Open Graph, description
  25. Error boundaries          -- Graceful degradation
```

**Critical dependency:** The `data/portfolio.ts` file is the foundation. Everything else consumes it. Define it first and completely before building components.

**Parallel work possible:** After Phase 1, the ProfileCard (Phase 2) and CommandParser (Phase 3) can be built simultaneously since they share no dependencies beyond the data layer.

## Scalability Considerations

This is a personal portfolio site. Scalability in the traditional sense (millions of users) is irrelevant. The relevant scaling concerns are:

| Concern | Approach |
|---------|----------|
| AI API costs | Rate limit the chat endpoint (e.g., 10 requests/minute per IP). Use Claude Haiku for cost efficiency if responses are simple. |
| Content growth | Portfolio data is a flat file. Even with 50 projects and 20 years of experience, it stays under 500 lines. No database needed. |
| Adding new commands | Command registry pattern means adding a command is one object addition. No parser changes. |
| Performance | Single-page app with minimal JS. Largest bundle concern is Framer Motion (~30KB gzipped). Terminal renders are lightweight DOM updates. |

## Sources

- Next.js App Router: Layouts and Pages -- https://nextjs.org/docs/app/getting-started/layouts-and-pages (verified, v16.1.6, HIGH confidence)
- Next.js Route Handlers -- https://nextjs.org/docs/app/api-reference/file-conventions/route (verified, v16.1.6, HIGH confidence, includes AI streaming example)
- Vercel AI SDK architecture (useChat + route handler pattern) -- from training data, MEDIUM confidence. The Next.js official docs confirm the `streamText` + `StreamingTextResponse` pattern for AI streaming in route handlers.
- Terminal UI patterns, command registry, state reducer -- from training data and established React patterns, HIGH confidence on the patterns themselves.
- @ai-sdk/anthropic provider -- from training data, MEDIUM confidence on exact API. Verify current package name and usage during implementation.
