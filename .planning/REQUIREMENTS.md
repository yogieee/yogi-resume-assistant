# Requirements: Yogi Assistant

**Defined:** 2026-03-11
**Core Value:** Terminal interface lets visitors discover Yogi's full professional profile through intuitive commands

## v1 Requirements

### Layout & Design

- [x] **LAYOUT-01**: Two-panel layout — profile card (left) + terminal (right) on desktop
- [x] **LAYOUT-02**: Responsive stacking — profile card moves to top, terminal full-width on mobile
- [ ] **LAYOUT-03**: Dark theme with glowing accents, monospace fonts, engineering console aesthetic
- [x] **LAYOUT-04**: Interactive 3D badge card with rounded corners, physics-based floating animation

### Profile Card

- [x] **PROF-01**: Display profile picture (badge image on 3D card)
- [x] **PROF-02**: Display name (Yogananda Govind), role, and professional tagline
- [x] **PROF-03**: Display location (United Kingdom)
- [x] **PROF-04**: Download Resume button linking to PDF in public folder
- [x] **PROF-05**: Social icons with links (LinkedIn, Email, Phone, GitHub)

### Terminal Core

- [x] **TERM-01**: Terminal header displaying "Yogi Dev Console v1.0"
- [x] **TERM-02**: Command input with `>` prompt and blinking cursor
- [x] **TERM-03**: Command parser supporting all 11 commands: help, about, skills, experience, projects, architecture, achievements, certifications, contact, resume, clear
- [x] **TERM-04**: Scrollable output window with auto-scroll on new content
- [x] **TERM-05**: Command history navigation with arrow up/down keys
- [x] **TERM-06**: Command autocomplete/suggestions (tab completion or suggestion chips)
- [x] **TERM-07**: Welcome message with onboarding guidance for first-time visitors

### Terminal Output

- [x] **OUT-01**: `help` — display all available commands with descriptions
- [x] **OUT-02**: `about` — display professional summary (name, role, experience overview, current focus)
- [x] **OUT-03**: `skills` — display skills grouped by category (Languages, Frameworks, Cloud, AI & Data, DevOps, Databases)
- [x] **OUT-04**: `experience` — display career timeline with company, role, dates, key contributions
- [x] **OUT-05**: `projects` — display project cards (Autowire.ai with description, features, architecture, tech stack, live link)
- [x] **OUT-06**: `architecture` — display ASCII architecture diagram for Autowire.ai
- [x] **OUT-07**: `achievements` — display key achievements with metrics
- [x] **OUT-08**: `certifications` — display certifications and in-progress certifications
- [x] **OUT-09**: `contact` — display contact details (Email, LinkedIn, GitHub)
- [x] **OUT-10**: `resume` — trigger resume PDF download
- [x] **OUT-11**: `clear` — clear terminal history
- [x] **OUT-12**: Formatted output with colored labels, structured sections, clickable links

### Animations

- [x] **ANIM-01**: Typing animation for terminal responses (skippable on click)
- [x] **ANIM-02**: Badge card floating effect using physics-based sway
- [x] **ANIM-03**: Terminal message entry animations (fade/slide in)
- [x] **ANIM-04**: Smooth transitions between states

### AI Mode

- [ ] **AI-01**: Toggle switch between Terminal Mode and AI Mode
- [ ] **AI-02**: AI endpoint using Claude API via Vercel AI SDK with streaming responses
- [ ] **AI-03**: System prompt grounded with full portfolio data, constrained to professional experience only
- [ ] **AI-04**: Temperature 0 to minimize hallucination
- [ ] **AI-05**: Graceful error handling when API is unavailable or rate limited
- [ ] **AI-06**: Visual indicator showing AI is "thinking"/streaming

### Security & Performance

- [ ] **SEC-01**: API key server-side only (never NEXT_PUBLIC_ prefixed)
- [ ] **SEC-02**: Rate limiting on AI endpoint to prevent cost explosion
- [ ] **SEC-03**: Environment variable validation on startup

### Production

- [ ] **PROD-01**: SEO meta tags (title, description, keywords)
- [ ] **PROD-02**: Open Graph tags for social link previews (LinkedIn, Twitter)
- [ ] **PROD-03**: Single portfolio data source feeding all consumers (profile card, commands, AI context)
- [ ] **PROD-04**: Easter egg commands (e.g., sudo, matrix) for memorable visitor experience

## v2 Requirements

### Enhanced AI

- **AI-V2-01**: RAG with vector embeddings for expanded portfolio content
- **AI-V2-02**: Conversation memory across session
- **AI-V2-03**: Suggested follow-up questions after AI responses

### Content

- **CONT-V2-01**: Multiple project entries (beyond Autowire.ai)
- **CONT-V2-02**: Blog/articles section accessible via terminal
- **CONT-V2-03**: Real profile photo replacing placeholder

### Analytics

- **ANAL-V2-01**: Visitor analytics (which commands are most used)
- **ANAL-V2-02**: AI query logging for insights
- **ANAL-V2-03**: Engagement tracking (time on site, commands executed)

### Advanced Terminal

- **ADV-V2-01**: Theme switching (multiple dark themes)
- **ADV-V2-02**: Terminal sound effects (optional)
- **ADV-V2-03**: Shareable terminal sessions via URL

## Out of Scope

| Feature | Reason |
|---------|--------|
| CMS / Admin panel | Portfolio data is static in code, no need for dynamic management |
| Authentication / Login | Public portfolio, no user accounts |
| Multi-language support | English only, target audience is UK/global tech |
| Blog / Content management | Pure portfolio focus for v1 |
| Real-time chat with visitors | Portfolio is one-directional presentation |
| xterm.js terminal emulator | Overkill (~200KB) for command parser; custom component is sufficient |
| next-themes | Dark-only by design; hardcode theme directly |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAYOUT-01 | Phase 2 | Complete |
| LAYOUT-02 | Phase 2 | Complete |
| LAYOUT-03 | Phase 1 | Complete |
| LAYOUT-04 | Phase 2 | Complete |
| PROF-01 | Phase 2 | Complete |
| PROF-02 | Phase 2 | Complete |
| PROF-03 | Phase 2 | Complete |
| PROF-04 | Phase 2 | Complete |
| PROF-05 | Phase 2 | Complete |
| TERM-01 | Phase 3 | Complete |
| TERM-02 | Phase 3 | Complete |
| TERM-03 | Phase 3 | Complete |
| TERM-04 | Phase 3 | Complete |
| TERM-05 | Phase 4 | Complete |
| TERM-06 | Phase 4 | Complete |
| TERM-07 | Phase 3 | Complete |
| OUT-01 | Phase 3 | Complete |
| OUT-02 | Phase 3 | Complete |
| OUT-03 | Phase 3 | Complete |
| OUT-04 | Phase 3 | Complete |
| OUT-05 | Phase 3 | Complete |
| OUT-06 | Phase 3 | Complete |
| OUT-07 | Phase 3 | Complete |
| OUT-08 | Phase 3 | Complete |
| OUT-09 | Phase 3 | Complete |
| OUT-10 | Phase 3 | Complete |
| OUT-11 | Phase 3 | Complete |
| OUT-12 | Phase 3 | Complete |
| ANIM-01 | Phase 4 | Complete |
| ANIM-02 | Phase 2 | Complete |
| ANIM-03 | Phase 4 | Complete |
| ANIM-04 | Phase 4 | Complete |
| AI-01 | Phase 5 | Pending |
| AI-02 | Phase 5 | Pending |
| AI-03 | Phase 5 | Pending |
| AI-04 | Phase 5 | Pending |
| AI-05 | Phase 5 | Pending |
| AI-06 | Phase 5 | Pending |
| SEC-01 | Phase 5 | Pending |
| SEC-02 | Phase 5 | Pending |
| SEC-03 | Phase 5 | Pending |
| PROD-01 | Phase 6 | Pending |
| PROD-02 | Phase 6 | Pending |
| PROD-03 | Phase 1 | Complete |
| PROD-04 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 45 total
- Mapped to phases: 45
- Unmapped: 0

---
*Requirements defined: 2026-03-11*
*Last updated: 2026-03-12 after Phase 4 completion*
