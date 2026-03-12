# Roadmap: Yogi Assistant

## Overview

Yogi Assistant is an AI-powered developer portfolio presented as an interactive terminal console. The roadmap progresses from data foundation through static UI, terminal implementation, terminal polish, AI integration, and production readiness. Each phase delivers a coherent, verifiable capability that builds on the previous one, with the terminal as the core product and AI as the headline differentiator.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Data Layer** - Project scaffold, types, portfolio data, global styles, theme
- [x] **Phase 2: Profile Card & Layout** - Two-panel responsive layout, interactive 3D badge card, social links, resume download
- [x] **Phase 3: Terminal Core** - Command parser, all 11 commands, formatted output, input handling, welcome message
- [x] **Phase 4: Terminal Polish** - Typing animation, command history, autocomplete, Framer Motion transitions
- [x] **Phase 5: AI Integration** - Claude API streaming, mode toggle, rate limiting, error handling, grounded system prompt
- [ ] **Phase 6: Production Readiness** - SEO, Open Graph tags, easter eggs, single data source validation, error boundaries
- [ ] **Phase 7: AI Caching & Smart Routing** - Intent router, pre-generated responses for common questions, response cache, minimal AI context, AI only for novel queries

## Phase Details

### Phase 1: Foundation & Data Layer
**Goal**: The project scaffold exists with typed portfolio data, global dark theme, and layout primitives ready for all downstream components
**Depends on**: Nothing (first phase)
**Requirements**: LAYOUT-03, PROD-03
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` starts the application and renders a dark-themed page with monospace fonts and glowing accent colors
  2. A single portfolio data file exists in TypeScript with full type definitions, containing all of Yogi's professional data (about, skills, experience, projects, achievements, certifications, contact)
  3. The portfolio data types are importable and consumable by any component without type errors
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js project with TypeScript, Tailwind v4, shadcn/ui
- [x] 01-02-PLAN.md — Portfolio TypeScript interfaces and complete data file
- [x] 01-03-PLAN.md — Dark console theme, font loading, and visual shell

### Phase 2: Profile Card & Layout
**Goal**: Visitors see a polished two-panel layout with a glassmorphism profile card displaying Yogi's identity, social links, and resume download -- responsive across devices
**Depends on**: Phase 1
**Requirements**: LAYOUT-01, LAYOUT-02, LAYOUT-04, PROF-01, PROF-02, PROF-03, PROF-04, PROF-05, ANIM-02
**Success Criteria** (what must be TRUE):
  1. On desktop, the page displays a two-panel layout with the profile card on the left and an empty terminal area on the right
  2. On mobile, the profile card stacks on top with the terminal area full-width below
  3. The profile card shows Yogi's photo (placeholder), name, role, tagline, and location with glassmorphism styling and a floating animation
  4. Clicking the Resume button downloads a PDF file; social icons link to LinkedIn, Email, Phone, and GitHub
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Install motion package and create two-panel responsive grid layout
- [x] 02-02-PLAN.md — Brand icon SVGs, social links component, and resume PDF placeholder
- [x] 02-03-PLAN.md — Interactive 3D badge card with physics, drag interaction, and page wiring

### Phase 3: Terminal Core
**Goal**: Visitors can type commands into the terminal and receive fully formatted portfolio content -- the primary interaction model works end-to-end
**Depends on**: Phase 2
**Requirements**: TERM-01, TERM-02, TERM-03, TERM-04, TERM-07, OUT-01, OUT-02, OUT-03, OUT-04, OUT-05, OUT-06, OUT-07, OUT-08, OUT-09, OUT-10, OUT-11, OUT-12
**Success Criteria** (what must be TRUE):
  1. The terminal displays a header ("Yogi Dev Console v1.0"), a command input with `>` prompt and blinking cursor, and a welcome message with guidance on first load
  2. Typing any of the 11 commands (help, about, skills, experience, projects, architecture, achievements, certifications, contact, resume, clear) produces formatted output with colored labels, structured sections, and clickable links
  3. The terminal auto-scrolls to show new output; the `clear` command resets the terminal; the `resume` command triggers a PDF download
  4. Typing an unrecognized command shows a helpful error message suggesting valid commands
  5. All command output data comes from the shared portfolio data file (not hardcoded in components)
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md — Terminal types, command registry, and state reducer (logic layer)
- [x] 03-02-PLAN.md — Terminal shell, input, and output dispatcher (UI shell)
- [x] 03-03-PLAN.md — All 11 command output renderers (formatted display)
- [x] 03-04-PLAN.md — Wire renderers into dispatcher and integrate terminal into page

### Phase 4: Terminal Polish
**Goal**: The terminal feels alive and professional -- typing animations, keyboard navigation, autocomplete, and smooth transitions elevate it beyond a basic command prompt
**Depends on**: Phase 3
**Requirements**: TERM-05, TERM-06, ANIM-01, ANIM-03, ANIM-04
**Success Criteria** (what must be TRUE):
  1. Pressing arrow up/down cycles through previously entered commands in the input field
  2. Tab completion or suggestion chips help visitors discover available commands without memorizing them
  3. Terminal responses appear with a typing animation that can be skipped by clicking; subsequent output renders instantly
  4. Terminal messages animate in (fade/slide) and state transitions are smooth via Framer Motion
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — Command history navigation with arrow up/down keys
- [x] 04-02-PLAN.md — Tab autocomplete and suggestion chips UI
- [x] 04-03-PLAN.md — Typing animation, fade+slide entry transitions, AnimatePresence

### Phase 5: AI Integration
**Goal**: Visitors can toggle to AI mode and ask natural language questions about Yogi's experience, receiving streaming responses grounded in portfolio data
**Depends on**: Phase 4
**Requirements**: AI-01, AI-02, AI-03, AI-04, AI-05, AI-06, SEC-01, SEC-02, SEC-03
**Success Criteria** (what must be TRUE):
  1. A visible toggle switches between Terminal Mode and AI Mode; the input behavior changes accordingly
  2. In AI mode, typing a question produces a streaming response that appears token-by-token with a visible "thinking" indicator
  3. AI responses are accurate to Yogi's portfolio data and the AI refuses to answer off-topic questions (no hallucination of unrelated content)
  4. When the API is unavailable or rate-limited, the user sees a clear error message instead of a broken state
  5. The API key is never exposed in client-side code; environment variables are validated on startup
**Plans**: 3 plans

Plans:
- [x] 05-01-PLAN.md — Install AI SDK, mode toggle, AI shell container with useChat
- [x] 05-02-PLAN.md — Route handler with Claude API, system prompt, and streaming
- [x] 05-03-PLAN.md — Rate limiting, error handling, and security hardening

### Phase 6: Production Readiness
**Goal**: The portfolio is ready to share publicly -- discoverable via search engines, shareable on social media, resilient to errors, and delightful with easter eggs
**Depends on**: Phase 5
**Requirements**: PROD-01, PROD-02, PROD-04
**Success Criteria** (what must be TRUE):
  1. The page has proper SEO meta tags (title, description, keywords) and Open Graph tags that produce a rich preview when shared on LinkedIn or Twitter
  2. Easter egg commands (sudo, matrix, etc.) produce fun, memorable responses
  3. Runtime errors in any component are caught by error boundaries and display a graceful fallback instead of a white screen
**Plans**: TBD

Plans:
- [ ] 06-01: SEO meta tags and Open Graph social previews
- [ ] 06-02: Easter egg commands and final polish
- [ ] 06-03: Error boundaries and production hardening

### Phase 7: AI Caching & Smart Routing
**Goal**: Minimize AI API calls and cost by routing predictable portfolio questions to pre-generated or cached responses, reserving Claude for truly novel queries -- with minimal context sent per AI call
**Depends on**: Phase 6
**Requirements**: None (optimization phase)
**Success Criteria** (what must be TRUE):
  1. An intent router classifies incoming questions as known-topic (projects, skills, experience, architecture, contact, etc.) or novel
  2. Known-topic questions return pre-generated static responses instantly without calling the AI API
  3. Novel questions are checked against a response cache (hash-based); cache hits return stored responses without an API call
  4. Cache misses call Claude with a minimal structured context snippet (not the full portfolio) and cache the result
  5. AI costs are dramatically reduced for typical visitor patterns (most questions are predictable)
**Plans**: 3 plans

Plans:
- [ ] 07-01-PLAN.md — Intent router, static responses, and minimal topic context
- [ ] 07-02-PLAN.md — Response cache with TTL and AI SDK caching middleware
- [ ] 07-03-PLAN.md — Wire three-tier routing into route handler

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Layer | 3/3 | ✓ Complete | 2026-03-11 |
| 2. Profile Card & Layout | 3/3 | ✓ Complete | 2026-03-12 |
| 3. Terminal Core | 4/4 | ✓ Complete | 2026-03-12 |
| 4. Terminal Polish | 3/3 | ✓ Complete | 2026-03-12 |
| 5. AI Integration | 3/3 | ✓ Complete | 2026-03-12 |
| 6. Production Readiness | 0/3 | Not started | - |
| 7. AI Caching & Smart Routing | 0/3 | Not started | - |
