---
phase: 02-profile-card-layout
plan: 01
subsystem: layout
tags: [grid, responsive, motion, tailwind]

dependency-graph:
  requires: [01-01, 01-03]
  provides: [two-panel-layout, motion-dependency, glow-backdrop]
  affects: [02-02, 02-03, 03-01]

tech-stack:
  added: [motion@12.35.2]
  patterns: [responsive-grid-layout, glassmorphism-backdrop]

file-tracking:
  key-files:
    modified: [src/app/page.tsx, package.json]

decisions:
  - id: 02-01-01
    decision: "Used Tailwind v4 canonical bg-linear-to-br instead of bg-gradient-to-br"
    rationale: "Tailwind v4 renamed gradient utilities; linter flagged the legacy class name"

metrics:
  duration: "1 min"
  completed: "2026-03-11"
---

# Phase 2 Plan 1: Grid Layout & Motion Install Summary

**One-liner:** Responsive two-panel grid (380px sidebar + fluid terminal) with motion@12 installed for upcoming profile card animations.

## What Was Done

### Task 1: Install motion package
- Installed `motion@12.35.2` (locked decision: use `motion` not `framer-motion`)
- Import path: `from "motion/react"`
- Commit: `0a6cd2f`

### Task 2: Two-panel responsive grid layout
- Replaced Phase 1 visual shell with production two-panel layout
- Desktop (>=1024px): `grid-cols-[380px_1fr]` -- profile card left, terminal right
- Mobile (<1024px): single column stack, profile on top
- Left aside has glow backdrop (`bg-linear-to-br from-glow-cyan/10 via-transparent to-glow-purple/10 blur-2xl`) for glassmorphism visibility
- Right section has styled terminal placeholder with console theme tokens
- Page remains a server component (no `"use client"`)
- Commit: `226cc91`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tailwind v4 canonical class name**
- **Found during:** Task 2
- **Issue:** Used `bg-gradient-to-br` which is the legacy Tailwind v3 class; Tailwind v4 uses `bg-linear-to-br`
- **Fix:** Replaced with `bg-linear-to-br` per linter suggestion
- **Files modified:** src/app/page.tsx
- **Commit:** 226cc91

## Verification

- `npx tsc --noEmit` passes with no type errors
- `npx next build` succeeds
- Layout uses existing console theme tokens (console-bg, console-surface, console-border, console-text-dim, glow-cyan, glow-purple)

## Next Phase Readiness

Plan 02-02 (ProfileCard component) can proceed. The left aside has a placeholder comment marking where the ProfileCard will be inserted. The glow backdrop is in place for glassmorphism `backdrop-blur` on the card.
