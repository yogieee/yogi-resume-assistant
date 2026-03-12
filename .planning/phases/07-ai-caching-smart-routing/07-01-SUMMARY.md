---
phase: 07-ai-caching-smart-routing
plan: 01
subsystem: ai-routing
tags: [intent-classification, static-responses, topic-context, cost-optimization]
dependency-graph:
  requires: [05-ai-integration]
  provides: [intent-router, static-responses, topic-context, stream-chunk-utility]
  affects: [07-02, 07-03]
tech-stack:
  added: []
  patterns: [keyword-intent-classification, portfolio-driven-response-generation, minimal-context-builder]
key-files:
  created:
    - src/lib/ai/intent-router.ts
    - src/lib/ai/static-responses.ts
    - src/lib/ai/topic-context.ts
  modified: []
decisions:
  - "07-01: LanguageModelV3StreamPart uses delta (not textDelta), requires id field, and structured finishReason/usage objects in AI SDK v6"
  - "07-01: Intent rules ordered most-specific-first (certifications before about) to prevent false keyword matches"
  - "07-01: textToStreamChunks emits text-start, text-delta[], text-end, finish sequence per SDK v6 stream protocol"
metrics:
  duration: 3 min
  completed: 2026-03-12
---

# Phase 7 Plan 1: Intent Router and Static Responses Summary

Keyword-based intent classification with pre-generated portfolio responses and minimal topic context for AI fallback.

## What Was Done

### Task 1: Intent Router (92488d6)
Created `src/lib/ai/intent-router.ts` with deterministic keyword/regex intent classification for 9 known portfolio topics (about, skills, experience, projects, architecture, achievements, certifications, contact, hire) plus "novel" fallback. Rules are ordered from most specific to least specific. Verified with 11 test cases covering all intents.

### Task 2: Static Responses, Stream Chunks, and Topic Context (9a9e17a)
Created `src/lib/ai/static-responses.ts` with dynamically generated responses for all 9 known intents, built from live portfolio data (not hardcoded strings). Added `textToStreamChunks` utility that converts text to `LanguageModelV3StreamPart[]` format for cache middleware compatibility. Created `src/lib/ai/topic-context.ts` with minimal context builder that produces system prompts at 17-36% the size of the full system prompt.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] LanguageModelV3StreamPart API mismatch**
- **Found during:** Task 2
- **Issue:** The plan's research examples used `textDelta` field and flat `finishReason: "stop"` / `usage: { promptTokens, completionTokens }`, but AI SDK v6 actually uses `delta` field, requires `id` on text parts, uses structured `finishReason: { unified, raw }`, and nested `usage: { inputTokens: { total, ... }, outputTokens: { total, ... } }`
- **Fix:** Updated `textToStreamChunks` to emit proper `text-start` / `text-delta` / `text-end` / `finish` sequence with correct field names and structures
- **Files modified:** src/lib/ai/static-responses.ts
- **Commit:** 9a9e17a

## Verification Results

- TypeScript: zero type errors in all three new files (`npx tsc --noEmit`)
- Intent classification: 11/11 test cases pass (all intents + novel fallback)
- Static responses: all 9 intents produce non-empty strings from portfolio data
- Stream chunks: produces text-start, text-delta[], text-end, finish sequence
- Minimal context: 17% (skills) to 36% (hire) of full system prompt size

## Next Phase Readiness

Plan 07-02 (response cache and caching middleware) can proceed. The three modules export:
- `classifyIntent(message): Intent` -- for route handler intent check
- `getStaticResponse(intent): string` -- for Tier 1 instant responses
- `textToStreamChunks(text): LanguageModelV3StreamPart[]` -- for cache pre-seeding
- `buildMinimalContext(topic): string` -- for cache-miss AI calls with reduced tokens
