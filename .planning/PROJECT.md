# Yogi Assistant

## What This Is

An AI-powered developer portfolio website that presents Yoganand Govind's professional profile as an interactive developer console. Recruiters and engineers explore experience, skills, and projects through a terminal-style interface with an AI chat mode powered by Claude. Features an interactive 3D badge card, intent-based AI routing, and response caching. Deployed on Vercel.

## Core Value

The terminal interface must let visitors discover Yogi's full professional profile through intuitive commands — this is the portfolio's primary interaction model.

## Requirements

### Validated

- Two-panel layout with interactive 3D badge card + terminal — v1.0
- Terminal with 13 commands (help, about, skills, experience, projects, architecture, achievements, certifications, contact, hire, resume, clear + easter eggs) — v1.0
- Terminal UX: typing animation, command history, autocomplete, auto-scroll — v1.0
- AI Mode with Claude streaming, intent routing, response caching — v1.0
- SEO, Open Graph with dynamic OG image, error boundaries — v1.0
- Portfolio data synced with resume (education, certifications, full work history) — v1.0

### Active

(None — next milestone requirements TBD)

### Out of Scope

- RAG / vector embeddings — data fits in context window, structured for future RAG
- CMS or admin panel — portfolio data is static in code
- Authentication — public portfolio, no login
- Blog or content management — pure portfolio focus
- Multi-language support — English only

## Context

**Owner:** Yoganand Govind — Senior Software Developer with 12+ years experience, specializing in Cloud & AI Platform Engineering (AWS). Creator of Autowired.ai (document extraction SaaS).

**Current role:** Senior Software Engineer at Mphasis UK Limited, London (Jan 2019–Present). Enterprise welfare platform for UK Government using IBM Cúram SPM. Previous: Software Developer at Mphasis India (2014–2018).

**Key project:** Autowired.ai — SaaS platform for AI-powered document extraction. Next.js 15 + AWS Lambda + Textract + Bedrock Data Automation + DynamoDB + S3.

**Current codebase:** 3,689 lines TypeScript/TSX across 125 files. Tech stack: Next.js 16, React, TypeScript, Tailwind v4, shadcn/ui, Motion, React Three Fiber, Vercel AI SDK v6, Claude Haiku 4.5.

**Portfolio data includes:**
- Professional summary, education (MCA, BCA — Bangalore University), interests
- Skills: 8 categories (Languages, Frontend, Backend, Cloud/AWS, AI & Data, Databases, DevOps, Enterprise)
- Experience: Mphasis UK (2019–Present) + Mphasis India (2014–2018) with 13 contributions
- Projects: Autowired.ai with full architecture and tech stack
- Achievements: 90% processing speedup, 40% cost optimization, 15+ Lambda services
- Certifications: AWS SA Associate (Active), AWS Developer (Inactive), IBM Curam V6.0.4, AWS GenAI (In Progress)
- Contact: Phone, Email, LinkedIn, GitHub

## Constraints

- **Tech Stack**: Next.js 16 (App Router), React, TypeScript, Tailwind v4, shadcn/ui, Motion
- **AI Provider**: Claude Haiku 4.5 via Vercel AI SDK v6
- **Deployment**: Vercel
- **Design**: Dark theme, terminal/console aesthetic, monospace fonts, OKLCH glow accents
- **Profile Photo**: Placeholder avatar (user will provide image later)
- **Resume**: PDF in public folder (Yoganandgovind-resume.pdf)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Claude Haiku 4.5 for AI mode | Cost-efficient, good quality for portfolio Q&A | Good |
| Three-tier response system (static/cache/API) | Eliminates API calls for 80%+ of questions | Good |
| Intent router with keyword matching | Zero-cost classification, no AI call needed | Good |
| React Three Fiber + Rapier for 3D badge | Replaced glassmorphism card, more memorable | Good |
| Vercel AI SDK v6 (not raw Anthropic SDK) | Streaming, caching middleware, useChat hook | Good |
| Tailwind v4 CSS-based config | No tailwind.config.ts, OKLCH variables | Good |
| Full context injection over RAG | Portfolio data fits in context window (~3K tokens) | Good |
| Vercel deployment | Natural Next.js host, free tier, simple CI/CD | Good |
| reactStrictMode: false | Prevents WebGL Context Lost on Canvas double-mount | Revisit |
| Dynamic OG image via ImageResponse | Terminal-themed, no static image needed | Good |

---
*Last updated: 2026-03-12 after v1.0 milestone*
