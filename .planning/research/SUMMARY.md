# Project Research Summary

**Project:** Yogi Assistant
**Domain:** AI-powered developer portfolio terminal
**Researched:** 2026-03-11
**Confidence:** HIGH

## Executive Summary

Yogi Assistant is a single-page developer portfolio disguised as a terminal console, with an AI conversational mode powered by Claude. The expert approach for this type of project is straightforward: a Next.js App Router application with a two-panel layout (static profile card on the left, interactive terminal on the right), a command registry pattern for terminal commands, and a server-side Route Handler proxying Claude API calls. The entire portfolio dataset lives in a single TypeScript data file consumed by the command parser, the profile card, and the AI system prompt -- this single-source-of-truth pattern is non-negotiable. The stack is modern and well-integrated: Next.js 16, React 19, TailwindCSS 4, Motion 12 (formerly Framer Motion), and the Vercel AI SDK for streaming Claude responses.

The recommended approach prioritizes the terminal foundation over AI integration. The command parser, data layer, and formatted output must work flawlessly before AI mode is added. The terminal is the product -- AI is the differentiator. Building AI first on a shaky terminal foundation guarantees rework. The profile card is independent and can be built in parallel with terminal internals.

The three highest-stakes risks are: (1) Claude API key exposure through incorrect environment variable naming or client-side SDK usage, (2) runaway API costs from an unprotected chat endpoint, and (3) the terminal being unusable on mobile where 40%+ of recruiter traffic originates. All three are preventable with upfront architectural decisions -- server-only Route Handler with rate limiting, and mobile-first responsive layout designed from day one. A secondary but important risk is AI hallucination: Claude will fabricate portfolio details unless the system prompt is aggressively grounded with explicit refusal instructions and the complete dataset.

## Key Findings

### Recommended Stack

The stack is a standard modern Next.js application with one notable decision: use the Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) instead of the raw Anthropic SDK. The AI SDK provides `useChat`, streaming helpers, and Route Handler integration that would take hundreds of lines to replicate manually. All package versions have been verified against the npm registry.

**Core technologies:**
- **Next.js 16.1.6**: App Router with server components, API routes for AI proxy, native Vercel deployment
- **React 19.2.4**: Server components stable, `use()` hook, improved streaming -- required by Next.js 16
- **TypeScript 5.9.3**: Type safety for command parsing and portfolio data -- non-negotiable for a professional portfolio
- **TailwindCSS 4.2.1**: CSS-first config (v4), utility-first approach perfect for terminal dark theme and glassmorphism
- **Motion 12.35.2**: Renamed from framer-motion, same API. Profile card animations and terminal output transitions
- **Vercel AI SDK 6.0.116 + @ai-sdk/anthropic 3.0.58**: Streaming chat with Claude via Route Handler. Handles message state, streaming display, error handling automatically
- **shadcn/ui (CLI)**: Accessible component primitives (Button, ScrollArea, Dialog) built on Radix. Only for profile card elements -- terminal UI is fully custom

**Critical version notes:**
- Use `motion` not `framer-motion` (same team, forward-looking package name)
- Use `@ai-sdk/anthropic` not `@anthropic-ai/sdk` (integrates with AI SDK streaming pipeline)
- TailwindCSS v4 uses CSS-based config (`@theme`), not `tailwind.config.js`
- Skip `next-themes` -- the site is dark-only, hardcode the theme
- Skip `xterm.js` -- massively overkill for a command parser portfolio

### Expected Features

**Must have (table stakes):**
- Working command system with help, about, skills, experience, projects, architecture, achievements, certifications, contact, resume, clear
- Command history with arrow key navigation
- Formatted terminal output with colors, sections, spacing (not raw text walls)
- Resume PDF download via both button and terminal command
- Welcome message with onboarding guidance
- Blinking cursor and auto-scroll on new output
- Responsive design (mobile stacks vertically with touch-friendly command shortcuts)
- Profile card with social links always visible

**Should have (differentiators):**
- AI conversational mode -- the headline feature that separates this from hundreds of terminal portfolio templates
- Streaming AI responses (tokens arrive in real-time, matching terminal aesthetic)
- Typing animation on welcome message (instant render on subsequent commands, always skippable)
- Glassmorphism profile card with entrance animation
- Command autocomplete / tab completion
- Easter eggs (sudo, matrix, cowsay)

**Defer (v2+):**
- RAG integration, voice input, visitor analytics dashboard, interactive architecture diagrams
- Blog/CMS integration, multi-language support, login/auth
- Sound effects, complex multi-step commands, real terminal emulation (xterm.js)
- PDF resume generation from data (just upload a real PDF)

### Architecture Approach

The application is a single-page Next.js app with two independent UI regions. The ProfileCard (left panel) is a Server Component consuming static portfolio data. The Terminal (right panel) is a Client Component that owns all interactive state via `useReducer` -- command history, mode (terminal/AI), and processing state. No global state library is needed. A command registry pattern maps command strings to structured output via discriminated unions, making commands self-documenting and type-safe. AI mode uses the Vercel AI SDK `useChat` hook on the client and a Route Handler (`app/api/chat/route.ts`) on the server, with portfolio data injected as the system prompt.

**Major components:**
1. **data/portfolio.ts** -- Single source of truth for all portfolio content, consumed by command parser, AI context builder, and profile card
2. **Terminal** -- Stateful container owning history, mode, and processing state via useReducer
3. **CommandParser (lib/)** -- Pure function mapping command strings to typed output objects via command registry
4. **app/api/chat/route.ts** -- Server-side Route Handler proxying Claude API calls with rate limiting
5. **ProfileCard** -- Server Component rendering developer identity, social links, resume download

**Key patterns to follow:**
- Command registry (extensible, self-documenting, auto-generates help)
- Discriminated unions for command output (type-safe, exhaustive rendering)
- Terminal state reducer (atomic state transitions for complex command processing)
- Single data file consumed by all three output surfaces (terminal, AI, profile card)

### Critical Pitfalls

1. **API key exposure** -- Never use `NEXT_PUBLIC_ANTHROPIC_API_KEY`. All Claude calls go through the Route Handler. Verify by searching `.next/static` build output for any key substring.

2. **Runaway AI costs** -- Rate limit `/api/chat` (10-20 req/IP/session, daily cap). Set `max_tokens: 300-500` on every call. Set a monthly spending cap in the Anthropic dashboard. Consider Claude Haiku for cost efficiency.

3. **Mobile terminal unusable** -- Design mobile layout from day one: profile stacked on top, terminal full-width below, sticky input bar at bottom, command suggestion chips for tap interaction, minimum 16px font-size on inputs to prevent iOS zoom.

4. **AI hallucination** -- System prompt must include ALL portfolio data as structured text with explicit refusal instructions: "If the answer is not in the provided data, say you don't have that information." Test adversarially with off-topic questions.

5. **Typing animation blocks input** -- Allow input during animation. Implement click/keypress to skip. Keep animation under 1-2 seconds. Queue commands typed during animation. Design this into Phase 1; retrofitting is painful.

6. **Data hardcoded in components** -- Portfolio data must live in `/data` files from day one, not inline in command handlers or components. Same data feeds terminal commands and AI system prompt. Wrong at the start means refactor later.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation and Data Layer
**Rationale:** Everything depends on the data layer and project scaffold. The portfolio data file is consumed by every other component. Types defined here propagate everywhere.
**Delivers:** Project scaffold, typed portfolio data, root layout with fonts/theme, utility functions, global styles
**Addresses:** Data separation (PITFALLS #7), type safety foundation
**Avoids:** Hardcoded data in components, type drift between consumers

### Phase 2: Static UI -- Profile Card and Layout
**Rationale:** The profile card has zero dependencies on terminal logic and can be completed quickly. The two-panel layout establishes the responsive grid that terminal components will fill.
**Delivers:** Two-panel responsive layout, profile card with glassmorphism, social links, resume download button, entrance animations
**Addresses:** Resume download (table stakes), social links (table stakes), responsive design (table stakes)
**Avoids:** Mobile layout as afterthought (PITFALLS #4)

### Phase 3: Terminal Core
**Rationale:** The terminal is the product. Command parser, state reducer, input handling, and formatted output must work before anything else. This is the largest phase and the one most likely to need iteration.
**Delivers:** Working terminal with all 11 commands, formatted output, command history (arrow keys), welcome message, blinking cursor, auto-scroll, clear command
**Addresses:** All table-stakes terminal features, command registry pattern, discriminated union output
**Avoids:** Typing animation blocking input (PITFALLS #1), monolithic terminal component

### Phase 4: Terminal Polish and Animation
**Rationale:** Polish is layered on top of a working terminal. Typing animation, transitions, and autocomplete should not be attempted until core commands work perfectly.
**Delivers:** Typing animation (welcome message only, skippable), Framer Motion enter/exit transitions, command autocomplete/suggestions
**Addresses:** Differentiator features (typing animation, autocomplete)
**Avoids:** Animation jank from over-animating (only animate latest output), animation blocking input

### Phase 5: AI Integration
**Rationale:** AI mode depends on a working terminal shell (it shares the same input/output flow). The Route Handler, system prompt, streaming, rate limiting, and error handling are a cohesive unit that should ship together.
**Delivers:** AI conversational mode with streaming responses, rate limiting, error handling, loading states, grounded system prompt
**Addresses:** Headline differentiator (AI mode), streaming responses
**Avoids:** API key exposure (PITFALLS #2), runaway costs (PITFALLS #3), hallucination (PITFALLS #5)

### Phase 6: Production Readiness
**Rationale:** SEO, error boundaries, accessibility audit, and performance optimization are the final layer before the portfolio is shared publicly.
**Delivers:** SEO metadata and OG tags, error boundaries, accessibility audit (ARIA roles, contrast, keyboard nav), performance optimization, analytics integration
**Addresses:** "Looks Done But Isn't" checklist from PITFALLS, production quality

### Phase Ordering Rationale

- **Data first (Phase 1)** because every component consumes `portfolio.ts`. Defining data types early prevents rework across all consumers.
- **Profile card before terminal (Phase 2)** because it is simpler, independent, and validates the responsive layout grid that the terminal will fill.
- **Terminal core before polish (Phase 3 before 4)** because animation and autocomplete are meaningless without working commands. Polish on a broken foundation is wasted effort.
- **AI after terminal (Phase 5)** because AI mode reuses the terminal's input/output flow. Building AI first would require temporary scaffolding that gets thrown away.
- **Production readiness last (Phase 6)** because SEO and error boundaries require the full application to exist before they can be properly implemented and tested.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 5 (AI Integration):** Verify Vercel AI SDK v6 `streamText` API shape against current docs. The `useChat` hook integration with a custom terminal reducer needs careful design. Rate limiting strategy (in-memory vs. KV store vs. Edge Middleware) needs a concrete decision.
- **Phase 4 (Terminal Polish):** Typing animation skip behavior and command queue interaction design needs prototyping. Tab completion UX on mobile needs research.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Standard Next.js scaffold + TypeScript data files. Well-documented.
- **Phase 2 (Profile Card):** Standard component with TailwindCSS + Motion. Glassmorphism is a known CSS pattern.
- **Phase 3 (Terminal Core):** Command registry and useReducer are established React patterns. The core challenge is output formatting quality, not architectural uncertainty.
- **Phase 6 (Production Readiness):** Standard Next.js SEO, error boundaries, and accessibility patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified against npm registry on 2026-03-11. Version compatibility confirmed. |
| Features | MEDIUM | Based on domain expertise of portfolio sites and recruiter behavior. No live competitive analysis performed (WebSearch unavailable). Feature priorities are sound but competitive landscape claims should be validated. |
| Architecture | HIGH | Next.js App Router patterns verified via official docs. Command registry, useReducer, and discriminated unions are established React patterns. AI SDK integration pattern is MEDIUM (verify `streamText` API shape). |
| Pitfalls | HIGH | All pitfalls are well-documented, repeatedly-observed failure patterns. No speculative claims. Version-specific behavior should be verified during implementation. |

**Overall confidence:** HIGH

### Gaps to Address

- **Vercel AI SDK v6 exact API:** The `streamText` and `useChat` APIs should be verified against current AI SDK v6 documentation before Phase 5 implementation. The pattern is correct but exact method signatures may have changed.
- **Rate limiting implementation:** No specific library was recommended. Evaluate `next-rate-limit`, Vercel KV, or Upstash Redis during Phase 5 planning.
- **Mobile terminal UX specifics:** Command suggestion chips / tap-to-execute buttons need design work. The concept is clear but the interaction design needs Phase 3 prototyping.
- **Competitive landscape:** WebSearch was unavailable. The claim that "AI-integrated terminal portfolios are rare" is based on domain knowledge. Validate with a quick GitHub/Product Hunt search before marketing the portfolio as novel.
- **Claude model choice for production:** Research recommends Haiku for cost efficiency but the project spec mentions Claude. Decide the exact model (Haiku vs. Sonnet) during Phase 5 based on response quality needs.

## Sources

### Primary (HIGH confidence)
- npm registry (live, 2026-03-11) -- All package versions verified
- Next.js official docs (v16.1.6) -- App Router layouts, Route Handlers, environment variables
- Next.js official docs -- AI streaming route handler pattern confirmed

### Secondary (MEDIUM confidence)
- Vercel AI SDK patterns -- `streamText`, `useChat`, `@ai-sdk/anthropic` integration (training data; verify exact v6 API)
- Terminal UI patterns, command registry, state reducer -- established React patterns from training data
- Developer portfolio and recruiter behavior domain knowledge -- feature priorities and UX expectations

### Tertiary (LOW confidence)
- Competitive landscape for terminal portfolios with AI -- based on domain knowledge, not live research
- Specific Claude model pricing tiers for portfolio use case -- verify current Anthropic pricing

---
*Research completed: 2026-03-11*
*Ready for roadmap: yes*
