# Yogi Assistant

## What This Is

An AI-powered developer portfolio website that presents Yogananda Govind's professional profile as an interactive developer console. Recruiters and engineers explore experience, skills, and projects through a terminal-style interface with an optional AI chat mode. Deployed on Vercel.

## Core Value

The terminal interface must let visitors discover Yogi's full professional profile through intuitive commands — this is the portfolio's primary interaction model.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Two-panel layout: profile card (left) + terminal (right)
- [ ] Glassmorphism floating profile card with name, role, tagline, location, social links, resume download
- [ ] Interactive terminal with command parser supporting: help, about, skills, experience, projects, architecture, achievements, certifications, contact, resume, clear
- [ ] Terminal UX: typing animation, command history (arrow keys), blinking cursor, auto-scroll, formatted output
- [ ] All portfolio data rendered through terminal command outputs
- [ ] AI Mode toggle: send questions to Claude API endpoint grounded with portfolio data
- [ ] Dark theme with glowing accents, monospace fonts, engineering console aesthetic
- [ ] Responsive design: mobile stacks profile on top, terminal full-width
- [ ] Framer Motion animations: terminal messages, profile card float, smooth transitions
- [ ] Resume PDF download from public folder

### Out of Scope

- RAG / vector embeddings — data fits in context window for v1, structured for future RAG
- CMS or admin panel — portfolio data is static in code
- Authentication — public portfolio, no login
- Blog or content management — pure portfolio focus
- Multi-language support — English only

## Context

**Owner:** Yogananda Govind — Senior Software Engineer with 12+ years experience, specializing in AI & Cloud (AWS). Creator of Autowire.ai (document extraction SaaS).

**Current role:** Senior Software Engineer at Mphasis UK Limited, London (2019–Present). Enterprise welfare platform for UK Government using IBM Cúram SPM.

**Key project:** Autowire.ai — SaaS platform for AI-powered document extraction. Next.js + AWS Lambda + Textract + Bedrock + DynamoDB + S3.

**Portfolio data includes:**
- Professional summary and about
- Skills: Languages, Frameworks, Cloud (AWS), AI & Data, DevOps, Databases
- Experience: Mphasis UK Limited timeline with key contributions
- Projects: Autowire.ai with architecture details
- Achievements: 90% processing time reduction, 40% cost optimization, multi-tenant SaaS, 15+ Lambda services
- Certifications: AWS Solutions Architect Associate, GenAI (in progress)
- Contact: LinkedIn (yoganandgovind), Email (Yoganand.Govind@gmail.com), Phone (+44 07365558999), GitHub (URL TBD)

**AI Mode approach:** Claude API via Anthropic SDK. Full portfolio data injected as system context. Temperature 0. Constrained to only answer about professional experience. Data files structured per section for future RAG readiness.

## Constraints

- **Tech Stack**: Next.js 14+ (App Router), React, TypeScript, TailwindCSS, shadcn/ui, Framer Motion — per user spec
- **AI Provider**: Claude API (Anthropic SDK) — chosen for quality and simplicity with Vercel
- **Deployment**: Vercel — natural fit for Next.js
- **Design**: Dark theme, terminal/console aesthetic, glassmorphism, monospace fonts
- **Profile Photo**: Placeholder avatar for v1 (user will provide image later)
- **Resume**: PDF file in public folder

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Claude API for AI mode | Best conversational quality, simple Vercel integration, grounded with portfolio data | — Pending |
| Full context injection over RAG | Portfolio data ~3K tokens, fits in context window, simpler v1 | — Pending |
| Vercel deployment | Natural Next.js host, free tier, simple CI/CD | — Pending |
| Placeholder profile photo | User will provide image later | — Pending |
| Data files per section | Modular data layer, RAG-ready structure for future | — Pending |

---
*Last updated: 2026-03-11 after initialization*
