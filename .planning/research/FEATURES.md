# Feature Research

**Domain:** AI-powered developer portfolio terminal
**Researched:** 2026-03-11
**Confidence:** MEDIUM (based on domain expertise; WebSearch unavailable for live ecosystem verification)

## Feature Landscape

This research maps the feature space for terminal-style developer portfolios with AI integration. The domain sits at the intersection of three genres: (1) traditional developer portfolios, (2) terminal/CLI-themed websites, and (3) AI-powered conversational interfaces. Features are categorized based on what recruiters and engineers expect, what surprises them positively, and what commonly backfires.

---

### Table Stakes (Users Expect These)

Missing any of these means visitors leave or perceive the site as incomplete/broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Working command system** | The entire value proposition. If commands don't parse correctly, visitors give up in 5 seconds. | Medium | Must handle typos, empty input, unknown commands gracefully. Error messages should be helpful, not just "command not found." |
| **help command** | First thing every visitor types. Without it, terminal is a black box. | Low | Should list all commands with brief descriptions. Consider categorized output for 10+ commands. |
| **Professional content commands** (about, skills, experience, projects, contact) | This is a portfolio -- visitors came to see credentials. | Low per command | Each command is Low individually, but formatting all outputs well is Medium collectively. |
| **Resume download** | Recruiters' primary action. If they can't get a PDF, the portfolio failed its job. | Low | Must work as both a command AND a visible button on the profile card. Two access paths are essential. |
| **Responsive design** | 30-40% of recruiter traffic is mobile (LinkedIn links opened on phones). | Medium | Terminal on mobile is inherently awkward. The stacked layout (profile top, terminal bottom) is the right call. Consider reducing terminal height on mobile. |
| **Fast initial load** | Portfolio visitors are impatient. 3+ second blank screen = bounce. | Medium | Next.js SSR/SSG helps. But heavy animations + fonts can slow perceived load. Show the terminal chrome immediately, animate content in. |
| **Command history** (arrow keys) | Anyone who has used a terminal expects this. Without it, the terminal feels fake. | Medium | Up/down arrow navigation through previous commands. Must not break with empty history or at boundaries. |
| **Blinking cursor** | Visual signal that the terminal is alive and accepting input. Without it, visitors don't know where to type. | Low | CSS animation. Simple but critical for affordance. |
| **Clear command** | Terminals get cluttered. Users expect to reset. | Low | Reset terminal output buffer. Trivial but expected. |
| **Dark theme** | Terminal = dark. A light terminal feels wrong. | Low | Already specified. This is non-negotiable for the genre. |
| **Social links** (LinkedIn, GitHub, Email) | Standard portfolio expectation. Recruiters need to reach out. | Low | On the profile card, always visible. Don't hide these behind commands only. |
| **Readable formatted output** | Terminal text that's just raw paragraphs is unreadable. Need structure, spacing, color coding. | Medium | Use colored labels, indentation, section headers, horizontal rules in terminal output. This is where most terminal portfolios fail -- they dump text walls. |
| **Auto-scroll on new output** | Terminal must scroll to latest output. | Low | Scroll to bottom on each new command output. But respect if user has scrolled up (don't yank them down). |
| **Accessible text** (selectable, good contrast) | Recruiters copy/paste details. Screen readers need to work. | Low | Don't use canvas rendering. Keep terminal output as real DOM text. Ensure contrast ratios meet WCAG AA. |

### Differentiators (Competitive Advantage)

These features make visitors say "this is impressive" and remember the portfolio. They separate this project from the dozens of terminal portfolio templates on GitHub.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI conversational mode** | The headline differentiator. Visitors can ask natural language questions about the candidate. Recruiters can ask "Does Yogi have AWS experience?" instead of hunting through commands. | High | Claude API integration, system prompt engineering, streaming responses, rate limiting, error handling. This is the feature that makes this portfolio genuinely novel. |
| **Typing animation on output** | Makes terminal feel alive and real. Creates the "wow" moment on first visit. | Medium | Must be skippable (click to complete). Slow typing on long outputs is infuriating. Balance: type the first line, then render rest quickly. |
| **Command suggestions / autocomplete** | When user starts typing, suggest matching commands. Reduces friction, teaches available commands. | Medium | Tab completion or inline ghost text. Extremely polished UX signal. Shows the developer understands CLI UX deeply. |
| **Glassmorphism profile card** | Visual wow factor. Frosted glass effect with the dark terminal behind it creates a modern, premium aesthetic. | Medium | backdrop-filter: blur(). Be careful with performance on older devices. Needs fallback. |
| **Architecture visualization** (ASCII art or structured diagram) | Shows system design thinking. Engineers love seeing how systems are built. Recruiters see "this person thinks at scale." | Medium | ASCII art diagrams in terminal output are very on-brand. Could also use a structured text representation with box-drawing characters. |
| **Streaming AI responses** | AI mode shows tokens arriving in real-time, like a real chat experience. Much better than waiting for full response. | Medium | Use Vercel AI SDK or raw SSE. Creates the impression of a live, thinking assistant. |
| **Easter eggs** (secret commands, konami code, games) | Developers love discovering hidden features. Creates shareability -- "try typing sudo on this portfolio." | Low each | Examples: `sudo` returns a joke, `matrix` triggers Matrix rain effect, `cowsay` wraps output in ASCII cow. Low effort, high delight. |
| **Welcome message with guided onboarding** | First-time visitors see a welcome message that teaches them the interface. "Type help to see available commands, or ask me anything in AI mode." | Low | Critical for non-technical visitors (recruiters). Without this, they stare at a blank terminal. |
| **Animated profile card entrance** | Card floats in with Framer Motion. Subtle but makes the page feel crafted, not templated. | Low | Already specified. Keep animations under 500ms. Don't block interaction. |
| **Theme/accent color customization** | Let visitors pick accent color (green, blue, amber terminal themes). Shows attention to detail. | Low | Store in localStorage. 3-4 preset themes is enough. Don't overengineer a full theme system. |
| **Command output with links** | Project cards link to live sites, GitHub links are clickable. Terminal output isn't trapped text. | Low | Render actual anchor tags within terminal output. Essential for projects command especially. |
| **Loading states for AI mode** | Animated dots, spinner, or "thinking..." message while AI processes. | Low | Without this, users think the site is broken during API latency. |
| **Sound effects** (optional, off by default) | Keystroke sounds, command execution beep. Deeply immersive when done right. | Low | Must be OFF by default. Some people browse at work. A toggle in settings is enough. |
| **Session persistence** | Command history survives page refresh. Returning visitors see "welcome back." | Low | sessionStorage or localStorage for history. Small touch, signals quality. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem like good ideas but actively hurt the portfolio's effectiveness.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Forced typing animation on everything** | "It looks cool" | After the first 10 seconds, it's infuriating. Recruiters have 30 portfolios to review. Making them wait for text to type out is hostile UX. | Type-animate the first output (welcome message). All subsequent command outputs should render instantly or very quickly (under 300ms). Let users click to skip any animation. |
| **Complex multi-step commands** (pipes, flags, arguments) | "Real terminals have pipes and flags" | Visitors are not power users of YOUR terminal. Complex syntax creates friction. Nobody will learn your custom CLI language. | Keep commands single-word. If a command needs parameters, use subcommands: `projects web` not `projects --filter=web --sort=date`. Better yet, just list everything. |
| **Login / authentication** | "Track who visits" | Massive friction. Zero recruiters will create an account to see your portfolio. You'll get zero visitors past the login screen. | Use anonymous analytics (Vercel Analytics, Plausible) to track visits without requiring login. |
| **Blog / CMS integration** | "Show thought leadership" | Scope creep. A blog is a separate product. It dilutes the terminal concept and rarely gets updated. | Link to external blog (Medium, dev.to) from the contact command. Keep the portfolio focused. |
| **Background music** | "Create atmosphere" | Autoplaying audio is universally hated. Even with a mute button, it signals poor judgment. | If you must, add it as an easter egg command (`play music`) that's opt-in. Never autoplay. |
| **Heavy 3D effects / Three.js background** | "Make it visually stunning" | Kills performance, drains laptop batteries, makes fans spin. Recruiters on corporate laptops will have a bad experience. | Glassmorphism + subtle CSS animations provide visual polish without GPU cost. The terminal content is the star, not the background. |
| **Overly verbose AI responses** | "Show off AI capability" | Long AI responses in a terminal are hard to read. Terminal is a constrained viewport. | Instruct Claude to keep responses concise (2-4 sentences). Add a system prompt constraint: "Be brief and direct. Use bullet points." |
| **Real terminal emulation** (xterm.js, full bash) | "Make it a real terminal" | Massive complexity for zero portfolio value. Security risks. Visitors don't want to `ls` your file system. | A custom command parser is the right call. It's simpler, safer, and you control the experience entirely. |
| **Multi-language / i18n** | "Reach global audience" | The portfolio is for a specific person in the UK market. Translation adds complexity with no ROI for v1. | English only. If needed later, it's a v2+ concern. |
| **PDF resume generation from data** | "Keep resume in sync with portfolio data" | Fragile, ugly output. PDF generation in browsers is a nightmare. Formatting never matches expectations. | Upload a professionally formatted PDF to the public folder. Update it manually when data changes. This is a portfolio, not a resume builder. |
| **Chat history persistence across sessions** | "Users can continue conversations" | AI costs money per token. Returning conversations reload context. Edge case nobody actually uses. | Fresh AI session each visit. The portfolio context is always the same anyway. |

---

## Feature Dependencies

```
Profile Card (static)          Terminal Shell (core)
       |                              |
       v                              v
  Social Links                  Command Parser
  Resume Download                     |
       |                    +---------+---------+
       v                    |         |         |
  Profile Animations   Command    Command    Command
  (Framer Motion)      History    Output     Suggestions
                          |      Formatting
                          v         |
                    Arrow Key       v
                    Navigation  Typing Animation
                                    |
                                    v
                              Skip Animation

AI Mode (independent track):
  Claude API Route
       |
       v
  System Prompt + Portfolio Context
       |
       v
  Streaming Response Handler
       |
       v
  AI Loading States
       |
       v
  Rate Limiting / Error Handling
```

**Key dependency chains:**

1. **Terminal shell must work before any commands** -- command parser is the foundation
2. **Command output formatting before typing animation** -- you need the content before you animate it
3. **AI API route before streaming** -- basic request/response before SSE streaming
4. **Welcome message before onboarding** -- first impression sets the interaction pattern
5. **Profile card is independent of terminal** -- can be built in parallel

---

## MVP Definition

### Launch With (v1)

These features constitute the minimum viable portfolio that's impressive enough to share.

1. **Two-panel layout** with profile card + terminal
2. **Profile card** with name, role, tagline, location, social links, resume download button
3. **Terminal shell** with command input, blinking cursor, auto-scroll
4. **All 11 commands** (help, about, skills, experience, projects, architecture, achievements, certifications, contact, resume, clear)
5. **Formatted terminal output** with colors, sections, spacing
6. **Command history** (arrow up/down)
7. **Welcome message** with onboarding guidance
8. **Responsive design** (mobile stacks vertically)
9. **Dark theme** with glowing accents
10. **Typing animation** on welcome message (instant on subsequent commands)
11. **Basic AI mode** with Claude API (non-streaming, simple request/response)
12. **Resume PDF download** (both button and command)
13. **Glassmorphism profile card** with entrance animation

### Add After Validation (v1.x)

Ship v1, get feedback from 5-10 people, then add based on what's missing.

1. **Streaming AI responses** -- upgrade from basic to SSE streaming
2. **Command autocomplete / tab completion** -- reduces friction for new visitors
3. **Typing animation on command outputs** -- with skip-on-click
4. **Easter eggs** (sudo, matrix, cowsay) -- delight features
5. **Theme selector** (2-3 terminal color themes)
6. **Session persistence** for command history
7. **AI response constraints** -- refine system prompt based on real questions people ask
8. **Analytics integration** (Vercel Analytics or Plausible)
9. **SEO optimization** -- meta tags, OG images, structured data for Google
10. **Performance optimization** -- lazy load AI mode, preload fonts

### Future Consideration (v2+)

Only if there's a clear need and the portfolio is actively driving engagement.

1. **RAG integration** -- if portfolio data grows beyond context window
2. **Voice input** for AI mode (speech-to-text)
3. **Visitor analytics dashboard** (private, for Yogi only)
4. **Multiple project showcases** -- when more projects are added
5. **Interactive architecture diagrams** -- clickable, expandable
6. **Command aliases** -- user-defined shortcuts
7. **Export conversation** -- download AI chat as text

---

## Feature Prioritization Matrix

Priority is determined by: (User Value x Recruiter Impact) / Implementation Cost. "Priority" is a rank order for implementation sequence.

| Feature | User Value | Implementation Cost | Recruiter Impact | Priority |
|---------|------------|---------------------|------------------|----------|
| Command parser + help | Critical | Low | Critical | 1 |
| Profile card (static content) | High | Low | Critical | 2 |
| Core commands (about, skills, experience, projects) | Critical | Low-Med | Critical | 3 |
| Formatted terminal output | High | Medium | High | 4 |
| Resume download (button + command) | High | Low | Critical | 5 |
| Welcome message + onboarding | High | Low | Critical | 6 |
| Command history (arrow keys) | High | Medium | Medium | 7 |
| Responsive design | High | Medium | High | 8 |
| Contact + social links | High | Low | Critical | 9 |
| Glassmorphism + animations | Medium | Medium | Medium | 10 |
| Basic AI mode (non-streaming) | High | High | High | 11 |
| Typing animation (welcome only) | Medium | Low | Low | 12 |
| Streaming AI responses | Medium | Medium | Medium | 13 |
| Command autocomplete | Medium | Medium | Medium | 14 |
| Easter eggs | Low | Low | Low | 15 |
| Theme selector | Low | Low | Low | 16 |
| Sound effects | Low | Low | Negative if default on | 17 |

**Reading this table:** Features 1-9 are the non-negotiable core. Feature 10-12 add polish. Feature 11 (AI mode) is the headline differentiator but is complex -- it should be built after the terminal foundation is solid. Features 13+ are post-launch enhancements.

---

## Domain-Specific Insights

### What recruiters actually do on portfolio sites

Based on domain knowledge of developer hiring workflows (MEDIUM confidence):

1. **Spend 30-90 seconds** on a portfolio. The terminal must deliver value in that window.
2. **Look for: skills match, years of experience, project complexity.** These must be accessible in 2-3 commands max.
3. **Download resume PDF** -- this is often the primary goal. Make it trivially easy.
4. **Copy contact details** -- email and LinkedIn. Must be selectable text.
5. **Share with hiring managers** -- the URL must work when shared (no broken state).

### What engineers actually do on portfolio sites

1. **Check the source code** -- your GitHub repo will be inspected. Code quality matters as much as the portfolio itself.
2. **Try to break it** -- they will type garbage, SQL injection attempts, profanity. Handle all of it gracefully.
3. **Look for real projects** -- links to live products and GitHub repos. "Built a todo app" does not impress.
4. **Judge the architecture command** -- engineers will specifically look at how you describe system design.

### The "terminal portfolio" competitive landscape

There are hundreds of terminal-style portfolio templates. Most share these weaknesses:

- **Poor onboarding** -- blank terminal with no guidance
- **Ugly output** -- raw text with no formatting
- **No mobile experience** -- terminal assumes desktop
- **Stale/template content** -- clearly a template, not personalized
- **No AI integration** -- this is where Yogi's portfolio differentiates

The AI conversational mode is genuinely uncommon in terminal portfolios and serves as the primary differentiator. Most "AI portfolio" sites use a chatbot widget, not a terminal-integrated experience.

---

## Sources

- Project specification: `/Users/yogieee/Desktop/My projects/yogi-assistant/initialprompt.md`
- Project definition: `/Users/yogieee/Desktop/My projects/yogi-assistant/.planning/PROJECT.md`
- Domain expertise on developer portfolios, terminal UX patterns, recruiter behavior, and AI integration patterns (MEDIUM confidence -- based on training data, not live verification)
- Note: WebSearch was unavailable for this research session. Competitive landscape claims are based on domain knowledge and should be validated with live research if critical decisions depend on them.
