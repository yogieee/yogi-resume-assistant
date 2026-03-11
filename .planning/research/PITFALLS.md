# Pitfalls Research

**Domain:** AI-powered developer portfolio terminal
**Researched:** 2026-03-11
**Confidence:** HIGH (based on deep domain expertise in terminal UIs, Next.js, Claude API integration, and portfolio site patterns)

**Note:** WebSearch was unavailable during this research. All findings are based on established domain knowledge of Next.js, terminal UI patterns, Claude API integration, and portfolio site design. Confidence is HIGH because these are well-documented, repeatedly-observed failure patterns -- not speculative claims. Flag for re-verification if any specific version-dependent claim seems stale.

---

## Critical Pitfalls

### Pitfall 1: Typing Animation Blocks User Input

**What goes wrong:** The terminal typing animation plays out character-by-character, and during that animation the input field is either hidden, disabled, or the user's next command gets swallowed. Visitors type their next command while output is still animating, and their keystrokes are lost or the terminal feels frozen.

**Why it happens:** Developers implement typing animation as a blocking sequential state -- the terminal is "busy" rendering output, so input is suppressed. This mimics how a real terminal works (command runs, then prompt returns), but real terminals finish in milliseconds. A typing animation takes 2-5 seconds, which is an eternity for an impatient recruiter.

**How to avoid:**
- Allow input to be typed at any time, even during animation playback
- Implement a "skip animation" behavior: if user presses Enter or starts typing during animation, instantly complete the current output and show the prompt
- Keep a command queue -- if user types a command while animation plays, queue it and execute after animation completes
- Keep animation duration short (max 1-2 seconds for any single output block)

**Warning signs:**
- QA test: type a command, immediately start typing the next one -- does it work?
- Animation duration for `experience` or `projects` commands exceeds 3 seconds
- No "skip" or "instant complete" mechanism exists in the code

**Phase to address:** Phase 1 (Terminal Core). This is foundational UX -- retrofitting skip behavior into an animation system designed without it is painful.

---

### Pitfall 2: Claude API Key Exposed to Client

**What goes wrong:** The Anthropic API key is included in client-side code, either through a `NEXT_PUBLIC_` environment variable prefix, or by calling the Anthropic SDK directly from a client component. Anyone can open DevTools, find the key, and rack up charges on your account.

**Why it happens:** Next.js App Router blurs the server/client boundary. Developers add `"use client"` to a component that needs interactivity, then import `@anthropic-ai/sdk` directly in that component. Or they name the env var `NEXT_PUBLIC_ANTHROPIC_API_KEY` because the client "needs" it.

**How to avoid:**
- Claude API calls go through a Next.js Route Handler (`app/api/chat/route.ts`) -- never from client code
- Environment variable is `ANTHROPIC_API_KEY` (no `NEXT_PUBLIC_` prefix)
- The client sends the user's question to your own `/api/chat` endpoint via `fetch`
- Add server-side rate limiting on the route handler (see Pitfall 3)
- Verify: run `next build`, then search the `.next/static` output for any substring of your API key

**Warning signs:**
- Any import of `@anthropic-ai/sdk` in a file with `"use client"`
- Environment variable starts with `NEXT_PUBLIC_ANTHROPIC`
- No `/api/` route exists for AI chat

**Phase to address:** Phase 1 (API route setup). Must be correct from the first line of AI integration code.

---

### Pitfall 3: No Rate Limiting on AI Endpoint = Runaway Costs

**What goes wrong:** The `/api/chat` endpoint has no rate limiting. A bot, a curious developer, or even a recruiter mashing Enter sends hundreds of requests. Each request costs Claude API tokens. A viral portfolio post on Hacker News could generate thousands of requests in hours, costing $50-$500+ unexpectedly.

**Why it happens:** Portfolio is "just a personal site" so security feels unnecessary. Developers think "who would abuse a portfolio?" The answer: bots, scrapers, and anyone who finds the endpoint.

**How to avoid:**
- Implement rate limiting on `/api/chat`: 10-20 requests per IP per session, 50-100 per IP per day
- Use `next-rate-limit`, Vercel's Edge Middleware, or a simple in-memory/KV rate limiter
- Set a hard monthly spending cap on your Anthropic account (Anthropic dashboard supports this)
- Add `max_tokens` cap on every API call (e.g., 300 tokens max response)
- Use Claude 3.5 Haiku (not Opus/Sonnet) for portfolio Q&A -- far cheaper, fast enough for this use case
- Monitor: set up Anthropic usage alerts

**Warning signs:**
- No rate limiting middleware on the `/api/chat` route
- No `max_tokens` parameter in Claude API calls
- No monthly budget cap set in Anthropic dashboard
- Using a more expensive model than necessary

**Phase to address:** Phase 2 (AI Integration). Rate limiting must ship alongside the AI feature, not as a follow-up.

---

### Pitfall 4: Terminal Is Unusable on Mobile

**What goes wrong:** The terminal looks great on desktop but is completely broken on mobile: virtual keyboard covers the terminal, text overflows horizontally, the input field is impossible to focus, command history (arrow keys) doesn't exist on mobile, and the two-panel layout is cramped.

**Why it happens:** Terminal UIs are inherently desktop-centric. Developers test on their laptop and forget that 40-60% of portfolio traffic comes from mobile (recruiters browsing LinkedIn on their phone, clicking through to your site).

**How to avoid:**
- Design mobile layout first: profile card stacked on top, terminal below as full-width
- On mobile, make terminal input a sticky bottom bar (like a chat app)
- Replace arrow-key history with a "recent commands" dropdown or tap-to-repeat buttons
- Add command suggestion chips/buttons above the input (tap `skills`, `experience`, `projects` instead of typing)
- Test with actual mobile virtual keyboard open -- does the input stay visible?
- Set `font-size: 16px` minimum on input fields to prevent iOS auto-zoom
- Use `overflow-x: auto` with `white-space: pre-wrap` for command outputs

**Warning signs:**
- No mobile-specific terminal interaction design (just CSS responsive breakpoints)
- Input field font-size below 16px
- No touch-friendly command shortcuts
- Testing only happens in Chrome DevTools responsive mode (not on real device)

**Phase to address:** Phase 1 (Layout & Terminal). Mobile layout must be designed alongside desktop, not bolted on after.

---

### Pitfall 5: AI Mode Hallucinates or Goes Off-Script

**What goes wrong:** Despite temperature 0 and system prompt constraints, Claude generates fabricated details about Yogi's experience -- inventing projects that don't exist, claiming certifications not listed, or stating employment at companies not in the data. A recruiter reads this, takes it at face value, and the portfolio becomes a liability.

**Why it happens:** Temperature 0 does not prevent hallucination -- it only makes output deterministic. If the portfolio data doesn't cover a topic the user asks about, Claude fills the gap with plausible-sounding fabrication. The system prompt says "only answer about professional experience" but Claude may still confabulate within that domain.

**How to avoid:**
- Inject ALL portfolio data in the system prompt as structured text (not vague summaries)
- System prompt must explicitly say: "If the answer is not found in the provided data, say 'I don't have that information about Yogi.' Do NOT guess or infer details not present in the data."
- Include a "grounding block" at the end of the system prompt that re-lists the data and says "This is the COMPLETE set of facts. Do not add to it."
- Test adversarially: ask "What university did Yogi attend?", "What's Yogi's salary?", "Has Yogi worked at Google?" -- verify refusal
- Set `max_tokens` to 300-500 to limit room for rambling/fabrication
- Keep temperature at 0 (confirmed in project spec)

**Warning signs:**
- System prompt uses vague instructions like "answer about Yogi's career" without providing the actual data
- No explicit instruction to refuse when data is missing
- No adversarial testing of edge cases
- AI gives long, flowing paragraphs (more room for hallucination vs. concise factual answers)

**Phase to address:** Phase 2 (AI Integration). System prompt engineering is the core of AI quality -- get it right before shipping.

---

### Pitfall 6: Accessibility Is an Afterthought

**What goes wrong:** The terminal is entirely mouse/keyboard dependent with no screen reader support, no ARIA roles, no focus management. The glassmorphism card has contrast ratios below WCAG AA. The typing animation creates issues for screen readers announcing character-by-character. The site is inaccessible to anyone using assistive technology.

**Why it happens:** "It's a terminal, it's inherently visual" thinking. But recruiters at large companies may use accessibility evaluation tools, and an inaccessible portfolio site for a senior engineer is a bad look.

**How to avoid:**
- Terminal output area: `role="log"` with `aria-live="polite"` (not `assertive` -- you don't want every typed character announced)
- Input field: proper `<input>` or `<textarea>` with `aria-label="Terminal command input"`
- For typing animation: set the final text immediately in the DOM for screen readers, animate only the visual reveal (CSS `clip-path` or opacity per character rather than DOM insertion)
- Glassmorphism card: ensure text contrast meets 4.5:1 against the blurred background (test with a11y tools)
- Glowing accents: don't rely on glow alone for interactivity cues
- Tab order: profile card links, then terminal input
- Command output: use semantic HTML within output (headings, lists) not just styled `<div>`s

**Warning signs:**
- No ARIA attributes anywhere in terminal components
- Using `div` with `onClick` instead of `button` for interactive elements
- Glassmorphism card text passes contrast only on certain backgrounds
- No keyboard-only navigation test performed

**Phase to address:** Phase 1 (Component Architecture). Accessibility is structural -- adding it later means rewriting components.

---

### Pitfall 7: Terminal Command Data Hardcoded in Components

**What goes wrong:** Portfolio data (skills, experience, projects) is embedded directly in the `CommandParser.tsx` or individual command handler components as inline strings, JSX, or objects. When Yogi needs to update a skill or add a project, he has to find the right component, edit JSX, hope he doesn't break formatting, and redeploy.

**Why it happens:** It's the fastest way to prototype. "I'll refactor later." But portfolio data changes every few months (new cert, new project, job change), and every update becomes a code change.

**How to avoid:**
- Create a `/data` directory with one file per section: `about.ts`, `skills.ts`, `experience.ts`, `projects.ts`, `achievements.ts`, `certifications.ts`, `contact.ts`
- Each file exports typed data (TypeScript interfaces)
- Command handlers import data and render it -- they never contain the data
- Same data files are injected into the AI system prompt -- single source of truth
- This also enables future RAG migration (data files become the indexing source)

**Warning signs:**
- Command handler files are >100 lines (they should be short renderers, not data stores)
- Updating portfolio content requires changing component logic
- AI system prompt has manually copied data that diverges from terminal output

**Phase to address:** Phase 1 (Data Architecture). This is project structure -- wrong at the start means refactor later.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Inline portfolio data in components | Fast to prototype | Every content update requires component changes; AI data drifts from terminal data | Never -- data files take 30 minutes to set up |
| No TypeScript interfaces for data | Slightly faster initial coding | Typos in data cause runtime errors, no autocomplete | Never -- types are cheap insurance |
| Single monolithic Terminal component | Quick to build initial demo | Impossible to maintain; history, input, output, animation, command parsing all tangled | Only for a throwaway prototype |
| No streaming for AI responses | Simpler API route | User stares at blank screen for 2-5 seconds waiting for full response | Acceptable for v1 if response times are <2s |
| Skip command history persistence | Less code | User refreshes page, loses context, has to retype commands | Acceptable for v1 -- nice-to-have |
| Global CSS instead of Tailwind utilities | Quick visual tweaks | Specificity wars, dead CSS, inconsistent styling | Never -- project already uses Tailwind |
| `any` types for command output | Faster initial implementation | No type safety on the most complex data flow in the app | Never -- define OutputBlock types upfront |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Framer Motion animating every terminal line | Page jank after 20+ commands, high CPU usage | Only animate the LATEST output block; previous outputs should be static DOM | After a session with 15-20+ commands |
| No virtualization for terminal history | Scrolling becomes laggy, memory usage grows | Limit visible history to last 50-100 entries; or use a virtual scroll (overkill for v1, just limit + `clear` command) | After 50+ command outputs |
| Re-rendering entire terminal on every keystroke | Input feels sluggish, cursor lags | Isolate input component state from output history; use `React.memo` on output blocks | Noticeable with 20+ history entries |
| Large Framer Motion bundle | 40-80KB added to initial bundle | Import only needed features: `import { motion } from 'framer-motion'` is fine, but avoid importing `AnimatePresence` etc. if not used; check bundle with `next build --analyze` | Matters for Lighthouse score |
| Typing animation using `setTimeout` chains | Animation freezes or speeds up unpredictably; memory leaks if component unmounts mid-animation | Use `requestAnimationFrame` or a proper animation library; always clean up timers in `useEffect` return | Manifests as ghost animations or memory leaks on fast navigation |
| Glassmorphism `backdrop-filter` on every element | GPU-heavy, battery drain on mobile, janky scroll | Apply `backdrop-filter: blur()` only to the profile card (one element), not to terminal or overlays | Mobile devices, older hardware |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No initial guidance -- blank terminal with blinking cursor | Recruiter has no idea what to type, leaves in 10 seconds | Show a welcome message with example commands on first load: "Type `help` to see available commands, or try `about`, `skills`, `experience`" |
| Too many commands without categorization | `help` dumps 11+ commands as a flat list; user is overwhelmed | Group commands: **Profile** (about, skills, experience) / **Projects** (projects, architecture) / **Other** (contact, resume, certifications) |
| Typing animation is mandatory with no skip | Recruiter who has seen the animation once now waits 3 seconds every single command | First visit: animate. Repeat commands or impatient users: allow click/keypress to skip to instant |
| Terminal-only navigation -- no visual fallbacks | Users who don't want to "play terminal" have no way to see the portfolio | Consider: command suggestion buttons/chips above input; or a subtle "view as traditional page" link |
| `clear` removes everything including welcome message | User clears, then forgets available commands | After `clear`, re-show a minimal prompt hint: "Type `help` for commands" |
| AI mode has no indication of thinking | User types question, nothing happens for 2-4 seconds, they think it's broken | Show "Thinking..." or a pulsing cursor indicator immediately while waiting for API response |
| Error messages are technical | "Error: 429 Too Many Requests" means nothing to a recruiter | User-friendly errors: "I need a moment to think. Please try again in a few seconds." |
| Overlong command outputs with no structure | `experience` dumps a wall of monospace text | Use formatted blocks with headers, bullets, spacing. Terminal aesthetic doesn't mean unformatted text |
| No way to copy text from terminal | User wants to copy an email or link, can't select text | Ensure standard text selection works in the output area; don't prevent default browser selection behavior |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| API key in `NEXT_PUBLIC_` env var | Key exposed in client bundle; anyone can steal it and use your API quota | Use `ANTHROPIC_API_KEY` (server-only); all API calls via Route Handler |
| No input sanitization on AI queries | Prompt injection: user crafts input to override system prompt, make Claude say anything | Sanitize input (strip obvious injection patterns); keep system prompt authoritative; set `max_tokens` low; add a response filter checking output stays on-topic |
| No rate limiting on `/api/chat` | Cost explosion from bots or viral traffic | IP-based rate limiting (10-20 req/session); global daily cap; Anthropic spending limit |
| Rendering AI response as raw HTML | XSS if AI output contains HTML/script tags (unlikely but possible with prompt injection) | Always render AI responses as plain text or sanitized markdown; never use `dangerouslySetInnerHTML` with AI output |
| Personal contact info in client-side data files | Email/phone harvestable by scraper bots | Accept this tradeoff (it's a portfolio) OR use obfuscation (render email as image, use contact form instead of raw email) |
| No CORS restriction on API route | Anyone can call your `/api/chat` from any origin | Set CORS headers or use Next.js middleware to restrict to your domain; Vercel's default is same-origin which helps |
| Logging user queries to console/DB without notice | GDPR concern (UK-based developer; users may be EU residents) | If logging queries, add a brief privacy note; or don't log user input at all |

---

## "Looks Done But Isn't" Checklist

These are things that work in demo but fail in production:

- [ ] **Mobile virtual keyboard tested** -- Does the terminal input stay visible when the keyboard opens? Test on real iOS Safari and Android Chrome, not just DevTools.
- [ ] **AI refusal tested** -- Ask Claude about things NOT in the portfolio data. Does it refuse or fabricate? Test: "What university did Yogi attend?", "What's Yogi's current salary?", "Tell me about Yogi's work at Amazon."
- [ ] **Rate limiting verified** -- Fire 50 rapid requests at `/api/chat`. Does it throttle? Or does it burn API credits?
- [ ] **Long output tested** -- Run `experience` then `projects` then `skills` then `achievements` back-to-back. Does the terminal scroll correctly? Does performance degrade?
- [ ] **Browser back/forward** -- Does pressing Back leave the site or do something weird? (SPAs often break browser navigation.)
- [ ] **Empty states handled** -- What happens if the API call fails? What if the user types an empty command? What about whitespace-only input?
- [ ] **Clipboard works** -- Can the user select and copy text from terminal output? Can they copy Yogi's email or LinkedIn URL?
- [ ] **Resume download works** -- Does the PDF actually download? Is it the right file? Does the button work on mobile?
- [ ] **Social links open correctly** -- Do LinkedIn/GitHub links open in new tabs? Are the URLs correct?
- [ ] **SEO/OG tags present** -- When shared on LinkedIn, does the site show a proper preview card? Title, description, OG image?
- [ ] **Loading state exists** -- What does the user see for the first 1-2 seconds while Next.js hydrates? A blank page? A flash of unstyled content?
- [ ] **Error boundary exists** -- If the terminal component crashes (bad command, JS error), does the whole page white-screen?
- [ ] **Print/PDF rendering** -- If a recruiter tries to print the page, is anything readable? (Low priority, but worth noting.)
- [ ] **Tab focus order logical** -- Tab through the entire page. Does focus move in a sensible order?

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Typing animation blocks input | Phase 1: Terminal Core | Type during animation -- keystrokes preserved? Skip works? |
| API key exposure | Phase 2: AI Integration (route setup) | Search `.next/static` output for API key substring |
| No rate limiting | Phase 2: AI Integration | Fire 50+ rapid requests; verify throttling |
| Mobile unusable | Phase 1: Layout & Responsive | Test on real iPhone Safari with virtual keyboard |
| AI hallucination | Phase 2: AI Integration (prompt engineering) | Adversarial question battery (10+ off-topic questions) |
| Accessibility gaps | Phase 1: Component Architecture | Screen reader test; keyboard-only navigation; contrast check |
| Data hardcoded in components | Phase 1: Data Architecture | Data files exist in `/data`; commands import from them |
| No welcome/onboarding | Phase 1: Terminal UX | First-time visitor test: can they figure out what to do in 5 seconds? |
| Framer Motion jank | Phase 1: Animation Polish | Run 30 commands in sequence; check for jank/CPU spike |
| No AI thinking indicator | Phase 2: AI Integration (UX) | Trigger AI query on slow connection; observe feedback |
| XSS via AI output | Phase 2: AI Integration (rendering) | Send prompt injection attempts; check rendered output |
| SEO/OG missing | Phase 3: Polish & Deploy | Share URL on LinkedIn/Twitter; check preview card |
| No error boundaries | Phase 1: Component Architecture | Deliberately cause an error in a child component; page should not white-screen |
| Cost runaway | Phase 2: AI Integration | Anthropic dashboard spending cap set; model choice is cost-appropriate |

---

## Sources

- Direct domain knowledge: Next.js App Router patterns (server/client boundary, Route Handlers, environment variables)
- Direct domain knowledge: Anthropic Claude API (temperature semantics, token limits, system prompt design, pricing tiers)
- Direct domain knowledge: Terminal UI implementation patterns (animation systems, virtual scrolling, input handling)
- Direct domain knowledge: Framer Motion performance characteristics (animation overhead, bundle size)
- Direct domain knowledge: Mobile web UX (virtual keyboard behavior, iOS Safari quirks, touch interaction)
- Direct domain knowledge: WCAG accessibility requirements (ARIA roles, contrast ratios, focus management)
- Direct domain knowledge: Vercel deployment (CORS defaults, environment variable handling, Edge Middleware)

**Confidence note:** WebSearch was unavailable. All findings are based on well-established patterns observed across many projects in this domain. No version-specific claims are made that would require current documentation verification. If any specific library version behavior is critical, verify with Context7 or official docs before relying on it.
