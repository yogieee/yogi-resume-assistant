# Phase 5: AI Integration - Research

**Researched:** 2026-03-12
**Domain:** Vercel AI SDK + Claude API streaming integration with Next.js App Router
**Confidence:** HIGH

## Summary

This phase adds an AI chat mode to the portfolio site using the Vercel AI SDK with Anthropic's Claude API. The Vercel AI SDK provides `streamText` (server-side) and `useChat` (client-side) that handle all streaming complexity -- SSE transport, message state, and progressive rendering -- out of the box.

The architecture is straightforward: a Next.js Route Handler at `/api/chat` receives messages, calls `streamText` with a system prompt grounded in portfolio data, and returns a streaming response. The client uses the `useChat` hook which manages conversation state, streaming status, and error handling automatically.

Key decisions already locked: AI mode is default, "Yogi AI" persona speaks in first person, in-memory rate limiting (sufficient for a portfolio site on Vercel Fluid Compute), and Claude Haiku 3.5 as the cost-effective model choice.

**Primary recommendation:** Use `ai` + `@ai-sdk/anthropic` + `@ai-sdk/react` packages with `streamText`/`useChat` pattern. Keep it simple -- no tools, no agents, just system prompt + streaming text.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `ai` | ^6.x | Core SDK: `streamText`, stream protocols | Official Vercel SDK, handles all streaming complexity |
| `@ai-sdk/anthropic` | ^1.x | Anthropic provider for AI SDK | Official provider, auto-configures with `ANTHROPIC_API_KEY` env var |
| `@ai-sdk/react` | ^1.x | React hooks: `useChat` | Framework-specific UI bindings, manages chat state + streaming |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | ^3.x | Environment variable validation | Already standard in AI SDK ecosystem; use for SEC-03 env validation |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@ai-sdk/anthropic` | Raw `@anthropic-ai/sdk` | Loses `useChat` integration, must manage SSE manually |
| In-memory rate limit | `@upstash/ratelimit` + Redis | Overkill for portfolio site; in-memory works with Vercel Fluid Compute |
| `claude-haiku-3.5` | `claude-sonnet-4-5` | 3.75x more expensive; Haiku is sufficient for portfolio Q&A |

**Installation:**
```bash
npm install ai @ai-sdk/anthropic @ai-sdk/react zod
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── api/
│       └── chat/
│           └── route.ts          # POST handler: streamText + system prompt
├── components/
│   ├── terminal/                 # Existing terminal components
│   ├── ai/
│   │   ├── ai-shell.tsx          # AI mode container (mirrors TerminalShell)
│   │   ├── ai-message.tsx        # Single message renderer (user/assistant)
│   │   ├── ai-welcome.tsx        # Welcome block with conversation starters
│   │   └── ai-thinking.tsx       # "Thinking..." animated indicator
│   └── mode-toggle.tsx           # Toggle switch between AI/Terminal modes
├── lib/
│   ├── ai/
│   │   ├── system-prompt.ts      # System prompt builder (injects portfolio data)
│   │   └── rate-limit.ts         # In-memory rate limiter utility
│   └── env.ts                    # Environment variable validation (zod)
└── data/
    └── portfolio.ts              # Existing — consumed by system prompt
```

### Pattern 1: Route Handler with streamText
**What:** Next.js App Router POST handler that receives messages and streams Claude responses
**When to use:** The single AI endpoint
**Example:**
```typescript
// src/app/api/chat/route.ts
// Source: https://ai-sdk.dev/docs/getting-started/nextjs-app-router
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { rateLimit } from '@/lib/ai/rate-limit';

export async function POST(req: Request) {
  // Rate limiting (SEC-02)
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = rateLimit(ip);
  if (!success) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429 }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic('claude-haiku-3-5-20241022'),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    temperature: 0,        // AI-04: minimize hallucination
    maxOutputTokens: 1024, // Keep responses concise
  });

  return result.toUIMessageStreamResponse();
}
```

### Pattern 2: useChat Hook on Client
**What:** React hook that manages chat state, streaming, and API communication
**When to use:** The AI shell component
**Example:**
```typescript
// Source: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
'use client';
import { useChat } from '@ai-sdk/react';

export function AiShell() {
  const {
    messages,      // UIMessage[] - full conversation
    sendMessage,   // (message) => void - send user input
    status,        // 'submitted' | 'streaming' | 'ready' | 'error'
    error,         // Error | undefined
    stop,          // () => void - abort streaming
    setMessages,   // (messages) => void - reset conversation
  } = useChat({
    // DefaultChatTransport auto-targets /api/chat
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Render messages, input, thinking indicator...
}
```

### Pattern 3: System Prompt Builder
**What:** Function that serializes portfolio data into a system prompt string
**When to use:** Called in the route handler to ground AI responses
**Example:**
```typescript
// src/lib/ai/system-prompt.ts
import { portfolio } from '@/data/portfolio';

export function buildSystemPrompt(): string {
  const { about, skills, experience, projects, achievements, certifications, contact } = portfolio;

  return `You are Yogi AI, the portfolio assistant for ${about.name}.
You speak in first person as Yoganand. You are professional, concise, technical, helpful, and slightly conversational.

## Your Identity
- Name: Yogi AI — Portfolio Assistant
- Role: Answer questions about Yoganand's experience, projects, skills, and background
- Tone: 60% developer console feel, 40% conversational AI

## Response Guidelines
- Keep responses 6-12 lines
- Short conversational intro + structured content (bullets) + optional call-to-action
- Use bold labels sparingly (e.g., "Project: Autowire.ai")
- No emojis, no heavy markdown headers
- For architecture/system design questions: include ASCII flow diagrams
- For skills/experience/about: use bullets, no diagrams
- Suggest related commands or topics at the end of responses

## Off-Topic
- Politely redirect: "I'm focused on Yoganand's portfolio — try asking about his projects or experience!"
- Stay in persona, never break character

## Portfolio Data

### About
${about.name} — ${about.role}
${about.summary.trim()}

### Skills
${skills.map(cat => `${cat.category}: ${cat.skills.map(s => s.name).join(', ')}`).join('\n')}

### Experience
${experience.map(exp => `${exp.title} at ${exp.company} (${exp.period})\n${exp.description}\n${exp.contributions.map(c => `- ${c}`).join('\n')}`).join('\n\n')}

### Projects
${projects.map(p => `${p.name} — ${p.subtitle}\n${p.description.trim()}\nFeatures: ${p.features.map(f => f.name).join('; ')}\nArchitecture: ${p.architecture.join(' → ')}\nTech: ${p.techStack.join(', ')}\nURL: ${p.liveUrl}`).join('\n\n')}

### Achievements
${achievements.map(a => `- ${a.description}`).join('\n')}

### Certifications
${certifications.map(c => `- ${c.name} (${c.status})`).join('\n')}

### Contact
${contact.map(c => `- ${c.label}: ${c.url}`).join('\n')}
`;
}
```

### Pattern 4: In-Memory Rate Limiter
**What:** Simple sliding window rate limiter using a Map
**When to use:** Protecting the AI endpoint from cost explosion
**Example:**
```typescript
// src/lib/ai/rate-limit.ts
const requests = new Map<string, number[]>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10;  // 10 requests per minute per IP

export function rateLimit(identifier: string): { success: boolean } {
  const now = Date.now();
  const timestamps = requests.get(identifier) ?? [];

  // Remove expired timestamps
  const valid = timestamps.filter(t => now - t < WINDOW_MS);

  if (valid.length >= MAX_REQUESTS) {
    requests.set(identifier, valid);
    return { success: false };
  }

  valid.push(now);
  requests.set(identifier, valid);
  return { success: true };
}

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of requests) {
    const valid = timestamps.filter(t => now - t < WINDOW_MS);
    if (valid.length === 0) {
      requests.delete(key);
    } else {
      requests.set(key, valid);
    }
  }
}, 60_000);
```

### Pattern 5: Environment Variable Validation
**What:** Validate required env vars at build/startup time
**When to use:** SEC-03 requirement
**Example:**
```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
});

// Validate at import time — fails fast if missing
export const env = envSchema.parse({
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
});
```

### Anti-Patterns to Avoid
- **Prefixing API key with NEXT_PUBLIC_:** Exposes secret to client bundle. Use `ANTHROPIC_API_KEY` (server-only, auto-detected by `@ai-sdk/anthropic`).
- **Building custom SSE streaming:** The AI SDK handles this entirely via `toUIMessageStreamResponse()` + `useChat`.
- **Routing AI input through terminal command parser:** AI mode should interpret ALL input as natural language. No `parseCommand()` calls.
- **Using tools/agents for a portfolio chatbot:** Unnecessary complexity. Plain `streamText` with a good system prompt is sufficient.
- **Storing conversation on server:** Stateless route handler. Conversation state lives in the client `useChat` hook.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSE streaming transport | Custom ReadableStream + EventSource | `streamText().toUIMessageStreamResponse()` + `useChat` | Protocol is complex, AI SDK handles reconnection, parsing, status |
| Chat state management | Custom useReducer for messages | `useChat` hook from `@ai-sdk/react` | Handles message appending, streaming status, error state, abort |
| Anthropic API client | Raw fetch to `api.anthropic.com` | `@ai-sdk/anthropic` provider | Handles auth, model selection, message format conversion |
| Stream text parsing | Manual SSE chunk concatenation | `useChat` auto-parses UI Message Stream Protocol | Format is structured JSON-SSE, not plain text |
| Environment validation | Manual `if (!process.env.X)` checks | `zod` schema parse | Type-safe, descriptive errors, single source of truth |

**Key insight:** The Vercel AI SDK exists precisely to eliminate the boilerplate of LLM streaming. The `streamText` + `useChat` pair handles 90% of the integration work.

## Common Pitfalls

### Pitfall 1: Using NEXT_PUBLIC_ prefix for API key
**What goes wrong:** API key is bundled into client-side JavaScript and exposed to anyone
**Why it happens:** Developer wants to test quickly and forgets security boundary
**How to avoid:** Only use `ANTHROPIC_API_KEY` (no prefix). The `@ai-sdk/anthropic` package reads it server-side automatically. The route handler runs server-side only.
**Warning signs:** API key visible in browser dev tools Network tab or Sources tab

### Pitfall 2: Forgetting to handle rate limit 429 in useChat
**What goes wrong:** User sees a cryptic error or the UI breaks when rate limited
**Why it happens:** Default `useChat` error handling may not display a friendly message
**How to avoid:** Use `onError` callback in `useChat` to detect 429 status and show the in-persona friendly message. The route handler should return a JSON body with the 429.
**Warning signs:** Unhandled error in console, broken UI state

### Pitfall 3: System prompt too large
**What goes wrong:** Token usage spikes, costs increase, responses slow down
**Why it happens:** Dumping raw portfolio data without summarization
**How to avoid:** Serialize portfolio data concisely. The current `portfolio.ts` data is small (~2KB serialized) so this is LOW risk. But avoid adding verbose descriptions.
**Warning signs:** High input token counts in API usage dashboard

### Pitfall 4: Not handling streaming abort
**What goes wrong:** User navigates away or switches modes while streaming, causing errors
**Why it happens:** Stream continues processing after component unmounts
**How to avoid:** Use the `stop()` function from `useChat` when switching modes. React cleanup in useEffect.
**Warning signs:** Console errors about state updates on unmounted components

### Pitfall 5: In-memory rate limiter memory leak
**What goes wrong:** Map grows unbounded on long-running instances
**Why it happens:** No cleanup of expired entries
**How to avoid:** Add periodic cleanup (setInterval) to prune expired timestamps from the Map
**Warning signs:** Increasing memory usage over time in monitoring

### Pitfall 6: Mode toggle race condition
**What goes wrong:** User rapidly toggles between AI and Terminal mode, causing incomplete state
**Why it happens:** Streaming response arrives for AI mode after switching to Terminal mode
**How to avoid:** Call `stop()` on useChat before switching to Terminal mode. Guard message rendering against mode state.
**Warning signs:** AI messages appearing in terminal view

## Code Examples

### Complete Route Handler (verified pattern)
```typescript
// src/app/api/chat/route.ts
// Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { rateLimit } from '@/lib/ai/rate-limit';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  const { success } = rateLimit(ip);

  if (!success) {
    return Response.json(
      { error: 'Too many requests. Please try again in a moment.' },
      { status: 429 }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: anthropic('claude-haiku-3-5-20241022'),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    temperature: 0,
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse();
}
```

### useChat Integration with Status Handling
```typescript
// Source: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
'use client';
import { useChat } from '@ai-sdk/react';

function AiShell() {
  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
  } = useChat({
    onError: (err) => {
      // Handle rate limit or API errors gracefully
      console.error('Chat error:', err);
    },
  });

  const isThinking = status === 'submitted';
  const isStreaming = status === 'streaming';

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          {message.parts.map((part, i) => {
            if (part.type === 'text') {
              return <span key={i}>{part.text}</span>;
            }
            return null;
          })}
        </div>
      ))}
      {isThinking && <div>Thinking...</div>}
      {error && <div>I'm getting a lot of questions right now. Try again in a moment.</div>}
    </div>
  );
}
```

### Mode Toggle State Management
```typescript
// Parent component managing mode state
'use client';
import { useState } from 'react';

type Mode = 'ai' | 'terminal';

function ModeContainer() {
  const [mode, setMode] = useState<Mode>('ai'); // AI is default

  return (
    <>
      <ModeToggle mode={mode} onToggle={setMode} />
      {mode === 'ai' ? <AiShell /> : <TerminalShell />}
    </>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useChat` with `handleSubmit` + `input` | `useChat` with `sendMessage` + manual input state | AI SDK v6 (late 2025) | `sendMessage` replaces `handleSubmit`/`append` pattern |
| `toDataStreamResponse()` | `toUIMessageStreamResponse()` | AI SDK v6 | New stream protocol with richer message parts |
| `content` property on messages | `parts` array on messages (UIMessage) | AI SDK v6 | Messages now have typed parts (text, tool-call, etc.) |
| `@ai-sdk/openai` as default | Multi-provider with `gateway()` option | AI SDK v5+ | Can use any provider interchangeably |
| `ai/react` imports | `@ai-sdk/react` separate package | AI SDK v5+ | Tree-shakeable, framework-specific packages |

**Deprecated/outdated:**
- `useChat` returning `input`/`handleInputChange`/`handleSubmit` -- replaced by `sendMessage` in v6
- `message.content` string -- replaced by `message.parts` array in v6
- `toDataStreamResponse()` -- replaced by `toUIMessageStreamResponse()` in v6
- Importing from `ai/react` -- now import from `@ai-sdk/react`

## Open Questions

1. **Exact Haiku model ID string**
   - What we know: `claude-haiku-3-5-20241022` is the dated version; `claude-3-5-haiku-latest` may also work
   - What's unclear: Whether `@ai-sdk/anthropic` accepts the `latest` alias
   - Recommendation: Use the dated model ID for deterministic behavior; verify at implementation time

2. **Vercel Fluid Compute and in-memory state**
   - What we know: Fluid Compute (default for new projects since April 2025) keeps instances alive longer and handles concurrent requests on same instance
   - What's unclear: Exact instance lifetime and whether rate limit Map persists long enough to be effective
   - Recommendation: In-memory is fine for a portfolio site. If rate limiting proves ineffective, upgrade to Upstash Redis later.

3. **AI SDK v6 `convertToModelMessages` behavior**
   - What we know: v6 introduced `UIMessage` type and `convertToModelMessages` to bridge UI messages to model format
   - What's unclear: Whether it handles edge cases like empty messages or very long conversations
   - Recommendation: Test with the actual SDK at implementation time; add a message limit (e.g., last 20 messages) as a safety guard

4. **Streaming smoothness**
   - What we know: AI SDK provides `smoothStream()` transform for smoother token rendering
   - What's unclear: Whether it works well with `toUIMessageStreamResponse()` in v6 (some issues reported)
   - Recommendation: Start without `smoothStream()`, add it later if token rendering feels choppy

## Sources

### Primary (HIGH confidence)
- [AI SDK streamText reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text) - Full parameter list, return types
- [AI SDK Getting Started: Next.js App Router](https://ai-sdk.dev/docs/getting-started/nextjs-app-router) - Route handler + useChat pattern
- [AI SDK Anthropic Provider](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic) - Package setup, model IDs, env vars
- [AI SDK useChat documentation](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot) - Hook API, status values, callbacks
- [AI SDK Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) - UI Message Stream format

### Secondary (MEDIUM confidence)
- [AI SDK 6 announcement](https://vercel.com/blog/ai-sdk-6) - v6 changes, migration path
- [Claude API Pricing](https://platform.claude.com/docs/en/about-claude/pricing) - Haiku 3.5 at $0.80/$4.00 per million tokens
- [Vercel Fluid Compute](https://vercel.com/blog/scale-to-one-how-fluid-solves-cold-starts) - Instance reuse for in-memory state

### Tertiary (LOW confidence)
- Various blog posts on in-memory rate limiting patterns for Next.js
- Community reports of `smoothStream` issues with v6

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - verified against official AI SDK docs, packages confirmed
- Architecture: HIGH - patterns directly from official getting-started guide, adapted to project structure
- Pitfalls: MEDIUM - mix of documented issues and community-reported problems
- Rate limiting: MEDIUM - in-memory approach is standard but Vercel Fluid Compute behavior not fully verified

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (AI SDK is actively developed; check for v6.x minor releases)
