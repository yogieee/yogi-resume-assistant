# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-11)

**Core value:** Terminal interface lets visitors discover Yogi's full professional profile through intuitive commands
**Current focus:** Phase 7 - AI Caching & Smart Routing (COMPLETE)

## Current Position

Phase: 7 of 7 (AI Caching & Smart Routing)
Plan: 3 of 3 in current phase
Status: Phase complete
Last activity: 2026-03-12 -- Completed 07-03-PLAN.md

Progress: [███████████████████] 19/19 plans (100%)

## Performance Metrics

**Velocity:**
- Total plans completed: 19
- Average duration: 2.0 min
- Total execution time: 0.61 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01 Foundation | 3/3 | 10 min | 3.3 min |
| 02 Profile Card | 3/3 | manual | manual |
| 03 Terminal Core | 4/4 | 4 min | 1.0 min |
| 04 Terminal Polish | 3/3 | 6 min | 2.0 min |
| 05 AI Integration | 3/3 | 10 min | 3.3 min |
| 07 AI Caching | 3/3 | 9 min | 3.0 min |

**Recent Trend:**
- Last 5 plans: 05-02 (4 min), 05-03 (3 min), 07-01 (3 min), 07-02 (4 min), 07-03 (2 min)
- Trend: stable/fast

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Roadmap: 6 phases derived from 45 requirements, research-aligned structure confirmed
- Roadmap: Use `motion` package (not `framer-motion`), Vercel AI SDK (not raw Anthropic SDK)
- 01-01: Tailwind v4 CSS-based config only (no tailwind.config.ts)
- 01-01: shadcn/ui base-nova style with neutral base color, OKLCH variables
- 01-02: Used `satisfies PortfolioData` over type annotation for inference preservation
- 01-03: OKLCH color space for all glow accent colors (perceptual uniformity)
- 01-03: Console palette: near-black bg (#0a0a0f), graduated surface elevation, slate text hierarchy
- 02-01: Tailwind v4 uses `bg-linear-to-br` (not `bg-gradient-to-br`)
- 02-02: Custom SVG icons over lucide-react brand icons (deprecated)
- 02-03: Replaced glassmorphism ProfileCard with interactive 3D badge (React Three Fiber + Rapier physics)
- 02-03: Set reactStrictMode: false to prevent WebGL Context Lost on Canvas double-mount
- 02-03: Profile info in header, social links/resume in footer (ProfileActions), 3D badge in left panel
- 03-01: CommandOutput includes 'clear' variant for type completeness; reducer intercepts before appending
- 03-01: Pure logic layer in src/lib/terminal/ with zero React imports
- 03-02: Native browser caret over custom block cursor; placeholder renderers for all output types until Plan 03
- 03-03: CSS grid for help table alignment; terminal-style [x]/[~] status badges for certifications
- 03-04: Kept ErrorOutput inline in dispatcher (simple single-div, no separate file needed)
- 04-01: History index uses -1 sentinel for "not browsing"; SET_INPUT resets historyIndex but not savedInput
- 04-01: Clear command stored in commandHistory (users may want to recall it)
- 04-03: Sequential typing for welcome (each line after previous completes); only pure-text outputs get typing
- 04-02: Suggestions clear on every keystroke; only set on Tab with multiple matches (avoids stale state)
- 04-02: Exact matches excluded from getCompletions (typing "help" + Tab shows nothing)
- 04-03: No exit animations on AnimatePresence -- clear resets instantly
- 05-01: AI SDK v6 sendMessage with parts array (not deprecated handleSubmit/content string)
- 05-01: Manual input state in AiShell (v6 useChat does not provide input/handleInputChange)
- 05-01: Page converted to client component for useState mode management
- 05-01: Cyan accent (glow-cyan) for AI mode elements to distinguish from terminal's glow-green
- 05-01: dangerouslySetInnerHTML for lightweight bold/code formatting (no markdown library)
- 05-02: Model updated to claude-haiku-4-5-20251001 (from planned claude-haiku-3-5-20241022) after user testing
- 05-02: temperature: 0 for minimal hallucination; maxOutputTokens: 1024 for concise responses
- 05-02: convertToModelMessages is async in AI SDK v6 (awaited in route handler)
- 05-03: Rate limit set to 15 req/min per IP (user adjusted from planned 10)
- 05-03: In-memory rate limiter sufficient for portfolio site (no KV store needed)
- 05-03: Input disabled during streaming to prevent double-sends
- 07-01: LanguageModelV3StreamPart uses delta (not textDelta), requires id field, structured finishReason/usage in SDK v6
- 07-01: Intent rules ordered most-specific-first (certifications before about) to prevent false keyword matches
- 07-01: textToStreamChunks emits text-start, text-delta[], text-end, finish sequence per SDK v6 stream protocol
- 07-02: V3 API uses request/response not rawCall -- CachedStreamData adapted accordingly
- 07-02: Removed wrapGenerate from caching middleware -- streaming is the only path used
- 07-02: specificationVersion: "v3" required by LanguageModelV3Middleware type
- 07-03: Pre-seed cache approach for known topics -- single code path via caching middleware for all tiers
- 07-03: buildMinimalContext replaces buildSystemPrompt in route handler for reduced token usage
- 07-03: Debug tier logging gated behind NODE_ENV=development

### Roadmap Evolution

- Phase 7 added: AI Caching & Smart Routing — intent router, pre-generated responses, response cache, minimal AI context

### Pending Todos

None.

### Blockers/Concerns

- Phase 4: Tab completion UX on mobile needs design decision

## Session Continuity

Last session: 2026-03-12
Stopped at: Completed 07-03-PLAN.md (Three-Tier Route Integration) -- ALL PHASES COMPLETE
Resume file: None
