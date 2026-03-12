---
phase: 07-ai-caching-smart-routing
plan: 02
subsystem: ai
tags: [caching, sha256, middleware, ai-sdk, TransformStream, simulateReadableStream]

# Dependency graph
requires:
  - phase: 05-ai-integration
    provides: AI chat route with streamText and Anthropic model
provides:
  - ResponseCache class with TTL and FIFO eviction
  - SHA-256 hashMessage utility for cache keys
  - LanguageModelV3Middleware for stream caching
affects: [07-03-integration, route.ts wrapLanguageModel usage]

# Tech tracking
tech-stack:
  added: []
  patterns: [LanguageModelV3Middleware for request interception, TransformStream for chunk capture, simulateReadableStream for cache replay]

key-files:
  created:
    - src/lib/ai/response-cache.ts
    - src/lib/ai/caching-middleware.ts
  modified: []

key-decisions:
  - "V3 API uses request/response not rawCall -- adapted CachedStreamData interface"
  - "Removed wrapGenerate from middleware -- streaming is the only path used by this app"
  - "specificationVersion: v3 required by LanguageModelV3Middleware type"

patterns-established:
  - "ResponseCache<T> generic class: reusable TTL cache with FIFO eviction"
  - "Stream caching via TransformStream collect-in-transform, persist-in-flush"

# Metrics
duration: 4min
completed: 2026-03-12
---

# Phase 7 Plan 2: Response Cache & Caching Middleware Summary

**In-memory SHA-256 response cache with AI SDK V3 middleware intercepting streamText for cache hit/miss routing**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-12T17:34:41Z
- **Completed:** 2026-03-12T17:38:20Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- ResponseCache class with TTL expiration, max-size FIFO eviction, and periodic cleanup
- SHA-256 hashMessage utility that normalizes input (lowercase, trim) for deterministic cache keys
- LanguageModelV3Middleware that intercepts streamText with cache check before calling Claude
- Cache hits replay stored chunks via simulateReadableStream; misses capture via TransformStream

## Task Commits

Each task was committed atomically:

1. **Task 1: In-memory response cache with TTL** - `36df06a` (feat)
2. **Task 2: AI SDK caching middleware** - `aaa4766` (feat)

## Files Created/Modified
- `src/lib/ai/response-cache.ts` - ResponseCache<T> class, CachedStreamData interface, hashMessage utility, singleton instance with periodic cleanup
- `src/lib/ai/caching-middleware.ts` - LanguageModelV3Middleware with wrapStream for cache hit replay and cache miss capture

## Decisions Made
- V3 provider API uses `request`/`response` fields on stream results, not `rawCall` -- adapted CachedStreamData to match actual types
- Removed `wrapGenerate` from middleware -- this app only uses `streamText`, and the V3 GenerateResult type is complex with no benefit for this use case
- Added `specificationVersion: "v3"` required by the LanguageModelV3Middleware type (not mentioned in plan)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] CachedStreamData interface used non-existent rawCall field**
- **Found during:** Task 2 (type checking)
- **Issue:** Plan specified `rawCall: { rawPrompt, rawSettings }` but LanguageModelV3StreamResult has `request?: { body? }` and `response?: { headers? }` -- no rawCall exists in V3
- **Fix:** Changed CachedStreamData to store `request` and `response` matching V3StreamResult shape
- **Files modified:** src/lib/ai/response-cache.ts, src/lib/ai/caching-middleware.ts
- **Verification:** `npx tsc --noEmit` passes clean
- **Committed in:** aaa4766 (Task 2 commit)

**2. [Rule 3 - Blocking] Missing specificationVersion on middleware object**
- **Found during:** Task 2 (type checking)
- **Issue:** LanguageModelV3Middleware requires `specificationVersion: "v3"` property
- **Fix:** Added the required field to the middleware object
- **Files modified:** src/lib/ai/caching-middleware.ts
- **Verification:** `npx tsc --noEmit` passes clean
- **Committed in:** aaa4766 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both fixes were required for type correctness with the actual AI SDK V3 API. No scope creep.

## Issues Encountered
None beyond the type mismatches documented in deviations.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Response cache and caching middleware ready for integration in route.ts
- Plan 07-03 will wire cachingMiddleware into the chat route via wrapLanguageModel
- All exports match the key_links specified in the plan frontmatter

---
*Phase: 07-ai-caching-smart-routing*
*Completed: 2026-03-12*
