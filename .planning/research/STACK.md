# Stack Research

**Domain:** AI-powered developer portfolio terminal
**Researched:** 2026-03-11
**Confidence:** HIGH (all versions verified via npm registry)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | ^16.1.6 | Full-stack React framework | App Router provides server components, API routes for AI proxy, and first-class Vercel deployment. v16 is current stable. The initial prompt says "14+" but there is no reason to use an older version for a greenfield project. |
| React | ^19.2.4 | UI library | Required by Next.js 16. React 19 brings server components as stable, `use()` hook, and improved streaming -- all beneficial for AI chat responses. |
| React DOM | ^19.2.4 | React renderer | Must match React version. |
| TypeScript | ^5.9.3 | Type safety | Non-negotiable for a professional portfolio. Catches terminal command parsing bugs at compile time. |
| TailwindCSS | ^4.2.1 | Utility-first CSS | Perfect for the glassmorphism card, terminal styling, and dark theme. v4 uses the new CSS-first config (no more tailwind.config.js). |
| motion | ^12.35.2 | Animations | Successor to framer-motion (same team, same API). Use `motion` not `framer-motion` for new projects. Powers typing animations, card floating, terminal message transitions. |

### AI Integration

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vercel AI SDK (`ai`) | ^6.0.116 | Streaming AI responses | Provides `useChat` hook, streaming UI helpers, and unified provider interface. Dramatically simplifies the AI Mode chat experience. Handles streaming, abort, retry out of the box. |
| @ai-sdk/anthropic | ^3.0.58 | Claude provider for AI SDK | Official Anthropic provider for Vercel AI SDK. Use this instead of `@anthropic-ai/sdk` directly -- it integrates with the streaming pipeline. |
| @anthropic-ai/sdk | ^0.78.0 | Direct Anthropic SDK (ALTERNATIVE) | Only use if you need direct API control beyond what AI SDK provides. For this project, prefer `@ai-sdk/anthropic` with Vercel AI SDK instead. |

**AI Integration Decision:** Use Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) rather than the raw Anthropic SDK. Rationale:
- `useChat` hook handles message state, streaming display, loading states, and error handling automatically
- Built-in streaming support renders tokens as they arrive (critical for terminal UX)
- System prompt injection is straightforward for grounding responses in portfolio data
- First-class Next.js App Router integration with Route Handlers
- The raw SDK would require building all of this from scratch

### UI Components

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| shadcn/ui | latest (CLI) | Pre-built accessible components | Not an npm package -- installed via `npx shadcn@latest init`. Provides Dialog, ScrollArea, Tooltip, Button components. Uses Radix primitives underneath. Only install components you need. |
| @radix-ui/react-scroll-area | ^1.2.10 | Scrollable terminal output | The terminal needs a custom-styled scrollable container. Radix ScrollArea gives accessible keyboard/touch scrolling with custom scrollbar styling. |
| @radix-ui/react-dialog | ^1.1.15 | Modal dialogs | For mobile menu, AI mode toggle panel, or resume preview modal. |
| @radix-ui/react-slot | ^1.2.4 | Component composition | Required by shadcn/ui Button component for asChild pattern. |
| lucide-react | ^0.577.0 | Icons | Clean, consistent icon set. Terminal prompt icon, social links, download button, mode toggle. Treeshakeable -- only ships icons you import. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | ^0.7.1 | Component variants | Required by shadcn/ui. Manages component style variants (button sizes, terminal output types). |
| clsx | ^2.1.1 | Conditional classnames | Cleaner than template literals for conditional Tailwind classes. |
| tailwind-merge | ^3.5.0 | Merge Tailwind classes | Prevents class conflicts when composing components. Used with clsx in shadcn/ui's `cn()` utility. |
| next-themes | ^0.4.6 | Theme management | Even though the site is dark-only, this provides the infrastructure if you want system/light mode later. LOW priority -- can skip initially. |
| react-type-animation | ^3.2.0 | Typing effect | Lightweight typing animation component. Use for the terminal welcome message and command output animations. Simpler than building a custom typewriter from scratch. |
| zod | ^4.3.6 | Schema validation | Peer dependency of Vercel AI SDK v6. Also useful for validating terminal command input and AI response structure. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint ^10.0.3 | Linting | Comes with `create-next-app`. Use `eslint-config-next` ^16.1.6 for Next.js-specific rules. |
| Prettier ^3.8.1 | Code formatting | Consistent formatting across the project. Add `prettier-plugin-tailwindcss` for class sorting. |
| @tailwindcss/postcss ^4.2.1 | PostCSS integration | Required for Tailwind v4 with Next.js. Replaces the old `tailwindcss` PostCSS plugin. |

## Installation

```bash
# Create Next.js project
npx create-next-app@latest yogi-assistant --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Core AI integration
npm install ai @ai-sdk/anthropic zod

# Animations and UI
npm install motion lucide-react react-type-animation
npm install clsx tailwind-merge class-variance-authority

# Initialize shadcn/ui (interactive -- choose defaults)
npx shadcn@latest init

# Add shadcn components as needed
npx shadcn@latest add button scroll-area dialog tooltip

# Dev tools
npm install -D prettier prettier-plugin-tailwindcss

# Environment variable (create .env.local)
echo "ANTHROPIC_API_KEY=your-key-here" > .env.local
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vercel AI SDK (`ai`) | @anthropic-ai/sdk (direct) | If you need fine-grained control over API calls, tool use, or multi-turn conversation management beyond what AI SDK abstracts. For this project, AI SDK is sufficient. |
| motion (v12) | framer-motion | They are the same codebase. `framer-motion` still works but `motion` is the forward-looking package name. Use `motion` for new projects. |
| react-type-animation | Custom typewriter hook | If you need pixel-perfect control over typing speed per character, cursor behavior, or need to type JSX (not just strings). A custom hook is ~30 lines but react-type-animation handles edge cases. |
| TailwindCSS v4 | TailwindCSS v3 | If you need `tailwind.config.js` based config (v4 uses CSS-based config). v4 is stable and recommended for new projects. |
| shadcn/ui | Radix Themes or Headless UI | If you want a fully pre-styled component library (Radix Themes) or non-Radix primitives (Headless UI). shadcn/ui gives the best balance: accessible primitives + full style control. |
| Next.js 16 | Astro or Remix | Astro if the site were purely static with no AI interaction. Remix if you prefer its data loading patterns. Next.js wins here because of Vercel deployment, AI SDK integration, and API routes for the Claude proxy. |
| lucide-react | react-icons or heroicons | react-icons bundles too many icon sets (bundle size). heroicons is fine but Lucide has better variety and shadcn/ui defaults to it. |
| next-themes | CSS custom properties manually | If you are 100% committed to dark-only, you can skip next-themes entirely and just set dark styles directly. Recommended: skip it and hardcode dark theme. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| framer-motion (package name) | Rebranded to `motion`. Both work today but `framer-motion` may stop receiving updates. | `motion` (same API, new package name) |
| @anthropic-ai/sdk directly | Requires manual streaming implementation, message state management, and error handling that AI SDK handles automatically. | `ai` + `@ai-sdk/anthropic` |
| styled-components / CSS Modules | Adds unnecessary complexity when Tailwind handles everything. The terminal aesthetic is all utility classes. | TailwindCSS |
| axios / node-fetch | Next.js has built-in `fetch` with caching, revalidation. AI SDK handles API calls to Claude. | Native fetch / AI SDK |
| react-icons | Massive bundle. Imports from multiple icon libraries bloat the build. | lucide-react (treeshakeable, consistent design) |
| xterm.js | Full terminal emulator -- massive overkill for a portfolio command parser. Adds ~200KB+ and complexity for features you will never use (ANSI escape codes, pty). | Custom terminal component with a command map and styled output |
| Create React App | Dead project, no SSR, no API routes, no server components. | Next.js |
| tailwind.config.js (v3 style) | TailwindCSS v4 uses CSS-based configuration via `@theme` directive. The JS config file is legacy. | CSS-based Tailwind v4 config |
| next-themes (for this project) | The portfolio is dark-theme-only per the design spec. Adding theme toggling adds complexity with zero value. | Hardcode dark theme via `<html class="dark">` or just use dark color values directly |

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| Next.js 16.1.x | React 18.2+ or React 19.x | Use React 19 for server components support |
| Vercel AI SDK 6.x | zod ^3.25.76 or ^4.1.8 | zod is a peer dependency; v4 is fine |
| TailwindCSS 4.x | @tailwindcss/postcss 4.x | Must use matching versions; replaces old postcss plugin |
| shadcn/ui (latest) | TailwindCSS 4.x, React 18/19 | The CLI auto-detects your setup and generates compatible code |
| motion 12.x | React 18/19 | Full React 19 support confirmed |
| ESLint 10.x | eslint-config-next 16.x | Major ESLint version must align with config version era |

## Key Architecture Notes for Roadmap

**API Route for AI Mode:** The Claude API key must NEVER be exposed client-side. Create a Next.js Route Handler (`app/api/chat/route.ts`) that proxies requests to Anthropic. The Vercel AI SDK makes this trivial:

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  const result = streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: `You are Yogi's portfolio assistant. Answer questions about his experience, skills, and projects based on the following data: ...`,
    messages,
  });
  return result.toDataStreamResponse();
}
```

**Environment Variables:**
- `ANTHROPIC_API_KEY` -- required, server-only (never prefixed with `NEXT_PUBLIC_`)
- Vercel deployment: set via Vercel dashboard environment variables

**Deployment:** Vercel auto-detects Next.js. Zero config needed. The AI route handler runs as a serverless function. Streaming responses work out of the box on Vercel.

## Sources

All versions verified via `npm view [package] version` on 2026-03-11 against the live npm registry:

- Next.js 16.1.6 (npm registry, latest tag)
- React 19.2.4 (npm registry, latest tag)
- TypeScript 5.9.3 (npm registry, latest tag)
- TailwindCSS 4.2.1 (npm registry, latest tag)
- motion 12.35.2 (npm registry, latest tag)
- Vercel AI SDK 6.0.116 (npm registry, latest tag)
- @ai-sdk/anthropic 3.0.58 (npm registry, latest tag)
- @anthropic-ai/sdk 0.78.0 (npm registry, latest tag)
- lucide-react 0.577.0 (npm registry, latest tag)
- react-type-animation 3.2.0 (npm registry, latest tag)
- zod 4.3.6 (npm registry, latest tag)
- shadcn/ui: CLI-based installation, not versioned as npm package
- Next.js peerDependencies confirmed React 19 compatibility

**Confidence note:** Package versions are HIGH confidence (verified live). API patterns for Vercel AI SDK are MEDIUM confidence (based on training data patterns; verify `streamText` API shape against current AI SDK v6 docs before implementation).
