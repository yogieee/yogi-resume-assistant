# Phase 7: AI Caching & Smart Routing - Research

**Researched:** 2026-03-12
**Domain:** Intent classification, response caching, AI cost optimization
**Confidence:** HIGH

## Summary

This phase optimizes AI API usage for a portfolio chatbot where the vast majority of questions are predictable (about skills, projects, experience, contact info, etc.). The approach is a three-tier routing strategy: (1) keyword-based intent classification routes known-topic questions to pre-generated static responses, (2) a hash-based response cache catches repeated novel questions, and (3) only true cache misses call Claude with minimal topic-specific context.

The Vercel AI SDK v6 (already installed at `ai@^6.0.116`) provides `LanguageModelV3Middleware` with `wrapLanguageModel` for implementing the caching layer natively. For static responses, `simulateReadableStream` can replay pre-generated text through the same streaming protocol that `useChat` expects, making the caching layer invisible to the client.

**Primary recommendation:** Use a keyword-based intent router (no ML, no embeddings) that maps questions to portfolio topics, returning pre-generated responses via `simulateReadableStream` through AI SDK middleware. Use in-memory Map caching (consistent with the existing rate limiter approach) with SHA-256 hash keys for novel query deduplication.

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `ai` | ^6.0.116 | `wrapLanguageModel`, `simulateReadableStream`, `LanguageModelV3Middleware` | Native middleware caching pattern, official SDK approach |
| `@ai-sdk/anthropic` | ^3.0.58 | Claude Haiku model provider | Already integrated |

### Supporting (No New Dependencies)
| Tool | Purpose | Why No Install |
|------|---------|----------------|
| `crypto` (Node built-in) | SHA-256 hashing for cache keys | Built into Node.js, no package needed |
| `Map` (JS built-in) | In-memory cache storage | Consistent with existing rate limiter pattern; portfolio site does not need Redis |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Keyword matching | Embedding similarity (semantic router) | Overkill for ~10 known portfolio topics; requires embedding model or vector DB |
| In-memory Map | Upstash Redis / Vercel KV | Unnecessary for single-instance portfolio site; adds dependency and cost |
| `simulateReadableStream` | Direct `Response` with custom stream | SDK approach is cleaner, compatible with `useChat` protocol automatically |
| Static pre-generated strings | LLM-classified intent routing | Adds latency and cost for a problem solvable with simple pattern matching |

**Installation:**
```bash
# No new packages needed -- all tools are already available
```

## Architecture Patterns

### Recommended Project Structure
```
src/lib/ai/
  system-prompt.ts          # Existing -- will be refactored to export topic snippets
  rate-limit.ts             # Existing -- unchanged
  intent-router.ts          # NEW: keyword-based intent classification
  static-responses.ts       # NEW: pre-generated responses for known topics
  topic-context.ts          # NEW: minimal context snippets per topic
  response-cache.ts         # NEW: hash-based in-memory response cache
  caching-middleware.ts     # NEW: LanguageModelV3Middleware implementation
```

### Pattern 1: Three-Tier Request Routing

**What:** Every incoming question is classified into one of three tiers before any AI call is made.
**When to use:** Always -- this is the core routing logic.

```
User Question
    |
    v
[Intent Router] -- keyword/pattern match
    |
    +-- Known Topic (e.g., "skills", "projects") --> Pre-generated static response
    |                                                 (no API call)
    +-- Novel Question --> [Response Cache] -- SHA-256 hash lookup
                              |
                              +-- Cache Hit --> Return cached response
                              |                 (no API call)
                              +-- Cache Miss --> [Claude Haiku API]
                                                 (minimal context)
                                                 --> Cache result
```

### Pattern 2: AI SDK Language Model Middleware for Caching

**What:** Use `wrapLanguageModel` + `LanguageModelV3Middleware` to intercept requests before they reach Claude.
**When to use:** For the response cache layer (Tier 2 and 3).

```typescript
// Source: https://ai-sdk.dev/docs/ai-sdk-core/middleware
// Source: https://ai-sdk.dev/cookbook/next/caching-middleware
import {
  wrapLanguageModel,
  simulateReadableStream,
} from "ai";
import type {
  LanguageModelV3Middleware,
  LanguageModelV3StreamPart,
} from "@ai-sdk/provider";

const cachingMiddleware: LanguageModelV3Middleware = {
  wrapGenerate: async ({ doGenerate, params }) => {
    const cacheKey = hashParams(params);
    const cached = responseCache.get(cacheKey);
    if (cached) return cached;

    const result = await doGenerate();
    responseCache.set(cacheKey, result);
    return result;
  },

  wrapStream: async ({ doStream, params }) => {
    const cacheKey = hashParams(params);
    const cached = responseCache.get(cacheKey);

    if (cached) {
      return {
        stream: simulateReadableStream({
          chunks: cached.chunks as LanguageModelV3StreamPart[],
          chunkDelayInMs: 15, // simulate typing feel
        }),
        rawCall: cached.rawCall,
      };
    }

    const { stream, ...rest } = await doStream();
    const chunks: LanguageModelV3StreamPart[] = [];

    const transformStream = new TransformStream<
      LanguageModelV3StreamPart,
      LanguageModelV3StreamPart
    >({
      transform(chunk, controller) {
        chunks.push(chunk);
        controller.enqueue(chunk);
      },
      flush() {
        responseCache.set(cacheKey, { chunks, rawCall: rest.rawCall });
      },
    });

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};

// Usage in route handler:
const model = wrapLanguageModel({
  model: anthropic("claude-haiku-4-5-20251001"),
  middleware: cachingMiddleware,
});
```

### Pattern 3: Intent Router as Pre-Middleware Check

**What:** Before even hitting the AI SDK middleware, check if the question matches a known topic and return a static response directly.
**When to use:** For Tier 1 (known-topic questions) -- bypasses the model entirely.

The intent router runs in the route handler BEFORE `streamText`. If it matches a known topic, it returns a pre-generated response using `simulateReadableStream` wrapped in the AI SDK's stream protocol. If no match, it falls through to the cached `streamText` call.

```typescript
// In route.ts -- simplified flow
export async function POST(req: Request) {
  // ... rate limiting ...

  const { messages } = await req.json();
  const lastMessage = getLastUserMessage(messages);

  // Tier 1: Known topic?
  const intent = classifyIntent(lastMessage);
  if (intent && intent !== "novel") {
    const staticResponse = getStaticResponse(intent);
    // Return as streaming response compatible with useChat
    return createStaticStreamResponse(staticResponse);
  }

  // Tier 2 & 3: Cache middleware handles cache hit/miss
  const result = streamText({
    model: wrappedModel, // model with caching middleware
    system: buildMinimalContext(lastMessage), // topic-specific, not full portfolio
    messages: await convertToModelMessages(messages.slice(-20)),
    temperature: 0,
    maxOutputTokens: 1024,
  });

  return result.toUIMessageStreamResponse();
}
```

### Pattern 4: Keyword-Based Intent Classification

**What:** A simple, deterministic classifier using keyword arrays and regex patterns per topic.
**When to use:** For a portfolio site with ~10 known topics, this is sufficient.

```typescript
type Intent =
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "architecture"
  | "achievements"
  | "certifications"
  | "contact"
  | "hire"
  | "novel";

interface IntentRule {
  intent: Intent;
  keywords: string[];
  patterns?: RegExp[];
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: "skills",
    keywords: ["skills", "technologies", "tech stack", "languages", "tools", "frameworks"],
    patterns: [/what (do|does|can) (you|yogi) (know|use|work with)/i],
  },
  {
    intent: "projects",
    keywords: ["projects", "autowire", "portfolio", "built", "created", "saas"],
    patterns: [/what (have|has) (you|yogi) (built|made|created)/i],
  },
  // ... more rules per topic
];

function classifyIntent(message: string): Intent {
  const normalized = message.toLowerCase().trim();

  for (const rule of INTENT_RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule.intent;
    }
    if (rule.patterns?.some((p) => p.test(normalized))) {
      return rule.intent;
    }
  }

  return "novel";
}
```

### Anti-Patterns to Avoid
- **Using an LLM for intent classification:** Adding a Claude call to decide whether to call Claude defeats the purpose. Keyword matching is sufficient for ~10 known topics.
- **Sending full portfolio as system prompt for every query:** The current `buildSystemPrompt()` sends ALL portfolio data (~2KB). For cache misses, send only the relevant topic section.
- **Cache without TTL:** Even in-memory caches need expiration to avoid serving stale responses after portfolio data changes.
- **Complex embedding pipeline:** Semantic similarity requires embedding models, vector storage, and similarity thresholds. Massive overkill for a portfolio chatbot.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Streaming cached responses | Custom HTTP stream protocol | `simulateReadableStream` from `ai` | Must match AI SDK wire protocol for `useChat` compatibility |
| Middleware/interceptor pattern | Custom request interceptor | `wrapLanguageModel` + `LanguageModelV3Middleware` | Native SDK pattern, handles both generate and stream |
| Stream chunk collection | Manual chunk accumulation | `TransformStream` piped through stream | Standard Web Streams API, clean and composable |
| Hash generation | Custom hashing | `crypto.createHash("sha256")` | Node.js built-in, deterministic, fast |

**Key insight:** The AI SDK middleware pattern is specifically designed for caching use cases. Fighting the SDK by building custom interceptors will break `useChat` compatibility.

## Common Pitfalls

### Pitfall 1: Static Response Format Incompatible with useChat
**What goes wrong:** Pre-generated responses returned as plain `Response.json()` break the `useChat` protocol on the client.
**Why it happens:** `useChat` expects a specific streaming data protocol (SSE-like with typed chunks).
**How to avoid:** Use `streamText` with a mock model or `simulateReadableStream` to return static responses through the same protocol. Alternatively, use `createUIMessageStream` to manually write text parts.
**Warning signs:** Client shows empty messages or parsing errors when receiving cached responses.

### Pitfall 2: Cache Key Collision or Over-Specificity
**What goes wrong:** Cache keys that include conversation history mean nearly every request is unique (no hits). Keys that are too broad return wrong responses.
**Why it happens:** Hashing the full messages array produces unique keys per conversation.
**How to avoid:** For the response cache, hash ONLY the last user message (normalized, lowercased, trimmed). The intent router already handles topic-level deduplication.
**Warning signs:** Cache hit rate stays near 0% despite repeated similar questions.

### Pitfall 3: Stale Cache After Portfolio Data Update
**What goes wrong:** Cached responses contain outdated information after portfolio.ts is edited.
**Why it happens:** In-memory cache persists until server restart; no invalidation on data change.
**How to avoid:** Use a reasonable TTL (e.g., 1 hour for response cache). On Vercel, deployments create new instances, so cache is naturally cleared on deploy. For dev, shorter TTL (5 min).
**Warning signs:** AI responses mention old project details or skills.

### Pitfall 4: Middleware Params Serialization Issues
**What goes wrong:** `JSON.stringify(params)` on middleware params fails or produces inconsistent keys.
**Why it happens:** Params may contain functions, circular references, or non-deterministic field ordering.
**How to avoid:** Extract only the relevant fields for cache key generation (model ID, messages text content, system prompt hash). Do not stringify the entire params object blindly.
**Warning signs:** Cache misses on identical requests, or crashes in the hashing function.

### Pitfall 5: Blocking the Response for Cache Writes
**What goes wrong:** Waiting for cache write to complete before sending response adds latency.
**Why it happens:** Awaiting cache set operations in the response path.
**How to avoid:** Cache writes happen in the `flush()` callback of `TransformStream`, which fires after the stream completes. This is non-blocking to the response. For in-memory `Map.set()`, this is synchronous and fast anyway.
**Warning signs:** Increased latency on cache-miss requests.

## Code Examples

### Creating a Static Stream Response Compatible with useChat

The cleanest approach for returning pre-generated responses is through the middleware pattern itself, using `simulateReadableStream`:

```typescript
// Source: https://ai-sdk.dev/docs/reference/ai-sdk-core/simulate-readable-stream
import { simulateReadableStream } from "ai";
import type { LanguageModelV3StreamPart } from "@ai-sdk/provider";

function textToStreamChunks(text: string): LanguageModelV3StreamPart[] {
  // Split into word-sized chunks for natural streaming feel
  const words = text.split(/(\s+)/);
  const chunks: LanguageModelV3StreamPart[] = words.map((word) => ({
    type: "text-delta",
    textDelta: word,
  }));
  chunks.push({
    type: "finish",
    finishReason: "stop",
    usage: { promptTokens: 0, completionTokens: 0 },
  });
  return chunks;
}
```

### Minimal Context Builder Per Topic

```typescript
import { portfolio } from "@/data/portfolio";

type TopicKey = "about" | "skills" | "experience" | "projects" | "achievements" | "certifications" | "contact";

const contextBuilders: Record<TopicKey, () => string> = {
  about: () => `${portfolio.about.name} -- ${portfolio.about.role}\n${portfolio.about.summary.trim()}`,

  skills: () => portfolio.skills
    .map((cat) => `${cat.category}: ${cat.skills.map((s) => s.name).join(", ")}`)
    .join("\n"),

  experience: () => portfolio.experience
    .map((exp) => `${exp.title} at ${exp.company} (${exp.period})\n${exp.contributions.map((c) => `- ${c}`).join("\n")}`)
    .join("\n\n"),

  projects: () => portfolio.projects
    .map((p) => `${p.name} -- ${p.subtitle}\n${p.description.trim()}\nTech: ${p.techStack.join(", ")}`)
    .join("\n\n"),

  // ... etc
};

/** Build minimal system prompt with only relevant topic context */
export function buildMinimalContext(detectedTopic: TopicKey | null): string {
  const base = `You are Yogi AI, portfolio assistant for ${portfolio.about.name}. Be concise, professional, technical.`;

  if (!detectedTopic || !contextBuilders[detectedTopic]) {
    // Fallback: send about + skills (smallest useful context)
    return `${base}\n\n${contextBuilders.about()}\n\n${contextBuilders.skills()}`;
  }

  return `${base}\n\n${contextBuilders[detectedTopic]()}`;
}
```

### In-Memory Response Cache with TTL

```typescript
interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour

class ResponseCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttl = DEFAULT_TTL): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttl });
  }

  get size(): number {
    return this.store.size;
  }
}

// Periodic cleanup (same pattern as rate-limit.ts)
```

### Hash Function for Cache Keys

```typescript
import { createHash } from "crypto";

export function hashMessage(message: string): string {
  return createHash("sha256")
    .update(message.toLowerCase().trim())
    .digest("hex");
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom HTTP stream interceptor | `LanguageModelV3Middleware` | AI SDK 3.4+ (stable in v6) | Native, composable caching pattern |
| `StreamingTextResponse` | `toUIMessageStreamResponse()` | AI SDK 5+ | Already using the current approach |
| Full context every call | Topic-specific minimal context | Best practice | Reduces token usage and cost per call |
| LLM-based intent routing | Keyword/pattern matching for known domains | Common wisdom for small chatbots | Zero additional API cost for classification |

**Deprecated/outdated:**
- `StreamingTextResponse` -- removed in AI SDK 5+, replaced by `toUIMessageStreamResponse()`
- `MockLanguageModelV1` -- renamed to `MockLanguageModelV3` in SDK v6 (follows provider spec v3)

## Open Questions

1. **Exact stream protocol for static responses**
   - What we know: `simulateReadableStream` works within middleware's `wrapStream`. The middleware approach is cleanest.
   - What's unclear: Whether returning a static response BEFORE calling `streamText` (Tier 1 bypass) requires manually constructing the AI SDK wire protocol, or if we can use `streamText` with a wrapped model whose middleware short-circuits.
   - Recommendation: Use the middleware approach for ALL tiers. The middleware's `wrapStream` can check intent first, return static via `simulateReadableStream` for known topics, check response cache for novel, and only call `doStream()` on true cache misses. This keeps everything flowing through `streamText` -> `toUIMessageStreamResponse()`.

2. **Cache size limits**
   - What we know: In-memory Map has no built-in size limit.
   - What's unclear: How many unique novel queries a portfolio site typically receives.
   - Recommendation: Set a max cache size (e.g., 200 entries) with LRU eviction, or rely on TTL alone since Vercel serverless functions have limited memory anyway.

3. **LanguageModelV3StreamPart type availability**
   - What we know: The type is from `@ai-sdk/provider` package.
   - What's unclear: Whether this is already installed as a transitive dependency of `ai@^6.0.116`.
   - Recommendation: Check at implementation time; may need explicit install of `@ai-sdk/provider` for type imports.

## Sources

### Primary (HIGH confidence)
- [AI SDK Caching Docs](https://ai-sdk.dev/docs/advanced/caching) -- middleware pattern, simulateReadableStream usage
- [AI SDK Middleware Docs](https://ai-sdk.dev/docs/ai-sdk-core/middleware) -- LanguageModelV3Middleware API, wrapLanguageModel
- [AI SDK Caching Middleware Cookbook](https://ai-sdk.dev/cookbook/next/caching-middleware) -- Complete implementation example
- [AI SDK simulateReadableStream Reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/simulate-readable-stream) -- API parameters
- [AI SDK wrapLanguageModel Reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/wrap-language-model) -- Function signature

### Secondary (MEDIUM confidence)
- [Droptica: Speed Up AI Chatbot Responses with Caching](https://www.droptica.com/blog/how-speed-ai-chatbot-responses-intelligent-caching/) -- Hash-based caching patterns
- [Vercel AI SDK 6 Blog](https://vercel.com/blog/ai-sdk-6) -- Middleware now stable in v6

### Tertiary (LOW confidence)
- [Premier Octet: Simulate Streamed Response](https://www.premieroctet.com/blog/en/how-to-simulate-a-streamed-response-with-the-vercel-ai-sdk) -- Static response pattern (could not verify due to rate limit)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all tools are from the AI SDK already installed, no new dependencies
- Architecture: HIGH -- middleware caching is the officially documented pattern, verified with multiple SDK sources
- Intent classification: HIGH -- keyword matching for ~10 topics is a well-understood, deterministic approach
- Pitfalls: MEDIUM -- static response wire protocol compatibility needs validation during implementation
- Cache strategy: HIGH -- in-memory Map with TTL follows the established pattern from rate-limit.ts

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (stable -- AI SDK v6 is mature, patterns unlikely to change)
