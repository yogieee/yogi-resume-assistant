# Yogi Resume Assistant

An AI-powered developer portfolio that presents Yoganand Govind's professional profile as an interactive developer console. Recruiters and engineers explore experience, skills, and projects through a terminal-style interface with an AI chat mode powered by Claude.

## Features

- **Interactive Terminal** — 13 commands (`help`, `about`, `skills`, `experience`, `projects`, `architecture`, `achievements`, `certifications`, `contact`, `hire`, `resume`, `clear`) with command history, tab autocomplete, typing animations, and hidden easter eggs
- **AI Chat Mode** — Ask anything about Yogi's background using Claude Haiku 4.5 with streaming responses
- **Three-Tier Response System** — Static responses, response caching, and live AI calls — 80%+ of questions answered with zero API cost
- **3D Badge Card** — Interactive badge with physics simulation (React Three Fiber + Rapier)
- **Dark Console Aesthetic** — Terminal-themed UI with OKLCH glow accents and monospace typography

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| 3D | React Three Fiber, Rapier Physics |
| Animation | Motion |
| AI | Vercel AI SDK v6, Claude Haiku 4.5 |
| Deployment | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude AI chat mode |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/chat/           # AI chat endpoint with rate limiting
│   ├── opengraph-image.tsx # Dynamic OG image generation
│   ├── error.tsx           # Error boundary
│   └── not-found.tsx       # 404 page
├── components/
│   ├── ai/                 # AI chat shell & welcome screen
│   ├── terminal/           # Terminal shell, input, output, renderers
│   └── badge-scene.tsx     # 3D badge card
├── data/
│   └── portfolio.ts        # Single source of truth for all portfolio data
├── lib/
│   ├── ai/                 # Intent router, static responses, caching, system prompt
│   └── terminal/           # Command registry, parser, types
└── types/
    └── portfolio.ts        # TypeScript interfaces for portfolio data
```

## Architecture

```
User Input
    │
    ├─ Terminal Mode ──→ Command Parser ──→ Renderer
    │
    └─ AI Mode ──→ Intent Router ──→ Static Response? ──→ Return cached
                                  ──→ Cache hit?       ──→ Return cached
                                  ──→ Cache miss       ──→ Claude API (streaming)
```

## License

Private project. All rights reserved.
