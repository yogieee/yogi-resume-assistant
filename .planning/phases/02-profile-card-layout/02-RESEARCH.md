# Phase 2: Profile Card & Layout - Research

**Researched:** 2026-03-11
**Domain:** CSS Grid layout, glassmorphism, motion animations, component architecture
**Confidence:** HIGH

## Summary

This phase builds a two-panel responsive layout with a glassmorphism profile card on the left and a terminal placeholder on the right, stacking vertically on mobile. The project already has Tailwind v4 with OKLCH console theme tokens, shadcn/ui button component, lucide-react for icons, and a complete `portfolio` data object with all profile fields (name, role, tagline, location, contact array with LinkedIn/GitHub/Email/Phone).

The implementation is straightforward: CSS Grid for the two-panel layout (Tailwind utilities), backdrop-blur + semi-transparent backgrounds for glassmorphism (using existing console tokens), `motion` package for floating animation and entrance effects, and lucide-react for social/utility icons.

**Primary recommendation:** Use Tailwind CSS Grid with `grid-cols-1 lg:grid-cols-[380px_1fr]` for the two-panel layout, build the profile card as a client component with `motion` animations, and bind all data from the existing `portfolio` data object.

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | ^4 | Layout grid, glassmorphism utilities, responsive breakpoints | Already configured with console theme tokens |
| motion | (to install) | Floating animation, entrance effects | Prior decision: use `motion` not `framer-motion` |
| lucide-react | ^0.577.0 | Utility icons (Mail, Phone, Download, MapPin, ExternalLink) | Already installed |
| next/image | 16.1.6 | Profile avatar with optimization | Built into Next.js |
| shadcn/ui Button | installed | Resume download button | Already installed with base-nova style |

### To Install
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion | latest (11.x) | Animation library | `npm install motion` -- required for ANIM-02 floating effect |

### Brand Icons Strategy
| Instead of | Use | Reason |
|------------|-----|--------|
| lucide-react brand icons (Linkedin, Github) | Inline SVG components or `@icons-pack/react-simple-icons` | Lucide deprecated brand icons in v0.475.0; they still work in 0.577.0 but show TypeScript deprecation warnings |

**Recommendation:** For only 4 brand icons (LinkedIn, GitHub, Email, Phone), use lucide-react's non-deprecated utility icons where possible (`Mail`, `Phone`, `Download`, `MapPin`) and create small inline SVG components for LinkedIn and GitHub logos. This avoids adding another dependency for just 2 icons.

**Installation:**
```bash
npm install motion
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── page.tsx                    # Main page with two-panel grid layout
├── components/
│   ├── ui/
│   │   └── button.tsx              # (existing) shadcn button
│   ├── profile-card.tsx            # Client component: glassmorphism card with motion
│   ├── social-links.tsx            # Social icons row with links
│   └── icons/                      # Custom brand SVG icon components
│       ├── linkedin-icon.tsx
│       └── github-icon.tsx
├── data/
│   └── portfolio.ts                # (existing) all profile data
└── types/
    └── portfolio.ts                # (existing) ContactInfo type already defined
```

### Pattern 1: Two-Panel Responsive Grid
**What:** CSS Grid layout that shows side-by-side on desktop, stacks on mobile
**When to use:** The main page layout
**Example:**
```typescript
// page.tsx - Server component (no "use client" needed at page level)
<main className="min-h-screen p-4 lg:p-8">
  <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
    <aside className="flex items-start lg:items-center">
      <ProfileCard />
    </aside>
    <section className="flex items-center justify-center">
      {/* Terminal placeholder - Phase 3+ */}
      <div className="w-full h-full min-h-[400px] rounded-xl border border-console-border bg-console-surface" />
    </section>
  </div>
</main>
```

### Pattern 2: Glassmorphism Card with Console Theme
**What:** Semi-transparent card with backdrop blur using existing OKLCH console tokens
**When to use:** The profile card component
**Example:**
```typescript
// Glassmorphism that harmonizes with console theme
<div className="
  relative rounded-2xl p-6
  bg-console-surface/80
  backdrop-blur-xl
  border border-console-border/50
  shadow-lg shadow-black/20
  ring-1 ring-white/5
">
  {/* Card content */}
</div>
```

Key classes breakdown:
- `bg-console-surface/80` -- semi-transparent using existing token (#12121a at 80% opacity)
- `backdrop-blur-xl` -- frosted glass effect (24px blur)
- `border border-console-border/50` -- subtle border using existing token
- `ring-1 ring-white/5` -- thin highlight ring for glass edge
- `shadow-lg shadow-black/20` -- soft depth shadow

### Pattern 3: Motion Floating Animation
**What:** Infinite subtle vertical float using motion keyframes
**When to use:** Profile card idle animation (ANIM-02)
**Example:**
```typescript
"use client"
import { motion } from "motion/react"

// Floating animation - subtle Y-axis oscillation
<motion.div
  animate={{
    y: [0, -8, 0],
  }}
  transition={{
    duration: 4,
    ease: "easeInOut",
    repeat: Infinity,
    repeatType: "loop",
  }}
>
  {/* Glassmorphism card */}
</motion.div>
```

### Pattern 4: Motion Entrance Animation
**What:** Fade-in + slide-up when component mounts
**When to use:** Profile card initial appearance
**Example:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {/* Content */}
</motion.div>
```

### Pattern 5: Combining Entrance + Floating
**What:** Entrance animation that transitions into continuous float
**When to use:** Profile card needs both entrance and idle animation
**Example:**
```typescript
"use client"
import { motion } from "motion/react"
import { useState } from "react"

function ProfileCard() {
  const [hasEntered, setHasEntered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={
        hasEntered
          ? { opacity: 1, y: [0, -8, 0], scale: 1 }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={
        hasEntered
          ? { y: { duration: 4, ease: "easeInOut", repeat: Infinity } }
          : { duration: 0.6, ease: "easeOut" }
      }
      onAnimationComplete={() => {
        if (!hasEntered) setHasEntered(true)
      }}
    >
      {/* Card content */}
    </motion.div>
  )
}
```

### Anti-Patterns to Avoid
- **Putting the grid in layout.tsx:** The two-panel layout is page-specific, not app-wide. Keep it in `page.tsx`.
- **Using flexbox instead of grid for two-panel:** Grid gives explicit column sizing (`380px_1fr`) that flex cannot easily replicate with the same control.
- **Applying backdrop-blur to large areas:** Backdrop blur is GPU-intensive. Apply it only to the profile card element, not to large containers or the body.
- **Using `framer-motion` import path:** The package is `motion` and the import MUST be `from "motion/react"`, not `from "framer-motion"`.
- **Making profile card a server component:** It needs `motion` animations and event handlers, so it must be a client component with `"use client"`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive breakpoints | Custom media queries | Tailwind `lg:` prefix | Consistent with project, mobile-first |
| Icon components | Custom SVG wrappers for standard icons | lucide-react (Mail, Phone, Download, MapPin) | Already installed, consistent sizing/stroke |
| Button styling | Custom button styles | shadcn/ui Button component | Already installed with base-nova variants |
| Image optimization | Raw `<img>` tags | `next/image` component | Automatic optimization, sizing, lazy loading |
| Animation orchestration | CSS @keyframes or requestAnimationFrame | `motion` package | Prior decision, better DX for React |
| Class merging | String concatenation | `cn()` from `@/lib/utils` | Already set up with clsx + tailwind-merge |

**Key insight:** This phase uses almost entirely existing dependencies. The only new install is `motion`. All layout, theming, icons, and buttons are already available.

## Common Pitfalls

### Pitfall 1: Glassmorphism Not Visible on Solid Backgrounds
**What goes wrong:** Backdrop blur has no visible effect when the background behind the card is a solid color.
**Why it happens:** Backdrop blur filters the content BEHIND the element. If the background is uniform `#0a0a0f`, blur has nothing to reveal.
**How to avoid:** Add a subtle gradient or glow element behind the profile card to give the blur something to work with. A positioned pseudo-element or a gradient on the grid area works well.
**Warning signs:** Card looks like a regular solid card, not glassy.
```typescript
// Add a subtle glow behind the card area
<div className="relative">
  <div className="absolute inset-0 bg-gradient-to-br from-glow-cyan/10 via-transparent to-glow-purple/10 rounded-3xl blur-2xl" />
  <ProfileCard />  {/* Has backdrop-blur-xl */}
</div>
```

### Pitfall 2: Motion Import Path
**What goes wrong:** Build fails or incorrect bundle.
**Why it happens:** Project decision was to use `motion` package (Vercel's fork), not `framer-motion`. The import path is different.
**How to avoid:** Always use `import { motion } from "motion/react"` -- never `from "framer-motion"`.
**Warning signs:** Module not found errors, or accidentally installing framer-motion.

### Pitfall 3: Lucide Brand Icon Deprecation Warnings
**What goes wrong:** TypeScript shows deprecation warnings when importing `Linkedin` or `Github` from lucide-react.
**Why it happens:** Lucide deprecated brand icons in v0.475.0. They still exist but are marked deprecated.
**How to avoid:** Either suppress warnings (not ideal) or create simple inline SVG components for LinkedIn and GitHub. Use non-deprecated lucide icons for Mail, Phone, Download, MapPin.
**Warning signs:** Yellow squiggles in editor on icon imports.

### Pitfall 4: Grid Column Sizing on Intermediate Screens
**What goes wrong:** Profile card is too wide or too narrow on tablet-sized screens.
**Why it happens:** Fixed `380px` column doesn't adapt between mobile and desktop.
**How to avoid:** Use `lg:grid-cols-[380px_1fr]` (not `md:`). On screens below `lg` (1024px), use single column stack. The card can have `max-w-sm mx-auto` in mobile view.
**Warning signs:** Card stretches full width on tablet.

### Pitfall 5: Resume PDF Not Found
**What goes wrong:** Download button returns 404.
**Why it happens:** PDF not placed in `/public` folder, or wrong path in href.
**How to avoid:** Place resume PDF at `/public/resume.pdf`. Use `<a href="/resume.pdf" download>` -- files in `/public` are served from root. Create a placeholder PDF if the real one isn't ready.
**Warning signs:** Clicking download does nothing or shows error page.

### Pitfall 6: next/image Without Explicit Dimensions
**What goes wrong:** Layout shift or build error.
**Why it happens:** Remote or dynamic images require explicit `width` and `height` props.
**How to avoid:** For the placeholder avatar, use a static import (auto-sized) or set explicit dimensions. For a placeholder, a simple CSS circle with initials works until a real photo is ready.
**Warning signs:** Next.js build warnings about missing image dimensions.

## Code Examples

### Complete Profile Card Component Structure
```typescript
// src/components/profile-card.tsx
"use client"

import { motion } from "motion/react"
import Image from "next/image"
import { MapPin, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/social-links"
import { portfolio } from "@/data/portfolio"

const { about, contact } = portfolio

export function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm mx-auto lg:max-w-none"
    >
      <div className="
        relative rounded-2xl p-6 space-y-5
        bg-console-surface/80 backdrop-blur-xl
        border border-console-border/50
        shadow-lg shadow-black/20 ring-1 ring-white/5
      ">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="size-24 rounded-full bg-console-elevated border-2 border-console-border flex items-center justify-center">
            <span className="text-2xl font-bold text-glow-cyan">YG</span>
          </div>
        </div>

        {/* Identity */}
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-console-text-bright">{about.name}</h1>
          <p className="text-sm text-glow-cyan">{about.role}</p>
          <p className="text-xs text-console-text-dim">{about.tagline}</p>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-sm text-console-text-dim">
          <MapPin className="size-3.5" />
          <span>{about.location}</span>
        </div>

        {/* Social Links */}
        <SocialLinks contacts={contact} />

        {/* Resume Download */}
        <Button variant="outline" className="w-full" asChild>
          <a href="/resume.pdf" download>
            <Download className="size-4" />
            Download Resume
          </a>
        </Button>
      </div>
    </motion.div>
  )
}
```

### Social Links Component
```typescript
// src/components/social-links.tsx
import { Mail, Phone } from "lucide-react"
import { LinkedinIcon } from "@/components/icons/linkedin-icon"
import { GithubIcon } from "@/components/icons/github-icon"
import type { ContactInfo } from "@/types/portfolio"

const iconMap: Record<ContactInfo["type"], React.ComponentType<{ className?: string }>> = {
  email: Mail,
  phone: Phone,
  linkedin: LinkedinIcon,
  github: GithubIcon,
}

export function SocialLinks({ contacts }: { contacts: ContactInfo[] }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {contacts.map((c) => {
        const Icon = iconMap[c.type]
        return (
          <a
            key={c.type}
            href={c.url}
            target={c.type === "email" || c.type === "phone" ? undefined : "_blank"}
            rel={c.type === "email" || c.type === "phone" ? undefined : "noopener noreferrer"}
            aria-label={c.label}
            className="
              p-2 rounded-lg
              text-console-text-dim hover:text-glow-cyan
              bg-console-elevated/50 hover:bg-console-elevated
              border border-transparent hover:border-console-border
              transition-colors duration-200
            "
          >
            <Icon className="size-4" />
          </a>
        )
      })}
    </div>
  )
}
```

### Custom Brand Icon (LinkedIn Example)
```typescript
// src/components/icons/linkedin-icon.tsx
export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
```

### Resume Download with shadcn Button
```typescript
// Using shadcn Button with "asChild" to render as <a> tag
// Note: shadcn/ui base-nova uses @base-ui/react Button, check if asChild is supported
// If not, use a regular <a> styled with buttonVariants
import { buttonVariants } from "@/components/ui/button"

<a
  href="/resume.pdf"
  download
  className={buttonVariants({ variant: "outline", className: "w-full gap-2" })}
>
  <Download className="size-4" />
  Download Resume
</a>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package (import from `motion/react`) | 2024 (v11+) | Different package name, same API surface |
| Tailwind config file (`tailwind.config.ts`) | CSS-based config (`@theme`, `@import`) | Tailwind v4 (2025) | No JS config file; use CSS variables |
| lucide-react brand icons | Deprecated; use inline SVG or simple-icons | v0.475.0 (2025) | Brand icons will eventually be removed |
| `next/image` with `layout` prop | `next/image` with `fill` or explicit width/height | Next.js 13+ | Simpler API, no layout prop |

**Deprecated/outdated:**
- `framer-motion` import path: Use `motion/react` instead
- `tailwind.config.ts`: Project uses Tailwind v4 CSS-only config
- Lucide `Linkedin` and `Github` icons: Deprecated, create inline SVG wrappers

## Open Questions

1. **shadcn/ui Button `asChild` support**
   - What we know: The project uses base-nova style which uses `@base-ui/react/button` not Radix. Base-UI Button may not support the `asChild` pattern from Radix Slot.
   - What's unclear: Whether `@base-ui/react` Button composes with `asChild` or needs a different pattern.
   - Recommendation: Use `buttonVariants()` to apply button styles to a plain `<a>` tag instead. This is safe and works regardless.

2. **Background content for glassmorphism effect**
   - What we know: Pure solid backgrounds make backdrop-blur invisible.
   - What's unclear: How prominent the glass effect should be -- subtle hint vs. obvious frosted glass.
   - Recommendation: Add a subtle radial gradient glow behind the card. Can be tuned during implementation.

3. **Profile photo placeholder vs. real photo**
   - What we know: Requirement says "placeholder avatar for v1".
   - What's unclear: Whether to use a generic avatar image or styled initials.
   - Recommendation: Use styled initials ("YG") in a circle with console-elevated background. Simple, on-theme, no external assets needed. Easy to swap for a real photo later with `next/image`.

## Sources

### Primary (HIGH confidence)
- Project codebase: `src/data/portfolio.ts`, `src/types/portfolio.ts`, `src/app/globals.css` -- verified all data fields and theme tokens
- [Motion official docs](https://motion.dev/docs/react) -- import path, animation API
- [Motion installation](https://motion.dev/docs/react-installation) -- compatibility with React 18.2+
- [Tailwind CSS backdrop-blur docs](https://tailwindcss.com/docs/backdrop-filter-blur) -- utility class names

### Secondary (MEDIUM confidence)
- [Epic Web Dev glassmorphism guide](https://www.epicweb.dev/tips/creating-glassmorphism-effects-with-tailwind-css) -- verified technique with Tailwind classes
- [Motion keyframes tutorial](https://motion.dev/tutorials/react-keyframes) -- repeat: Infinity pattern
- [Lucide brand icons deprecation](https://github.com/lucide-icons/lucide/issues/2792) -- confirmed deprecated in v0.475.0
- [Lucide LinkedIn icon page](https://lucide.dev/icons/linkedin) -- confirmed still available but deprecated

### Tertiary (LOW confidence)
- [@icons-pack/react-simple-icons](https://www.npmjs.com/package/@icons-pack/react-simple-icons) -- alternative for brand icons if needed

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed except `motion`, which is a locked prior decision
- Architecture: HIGH -- standard Tailwind Grid + React component patterns, verified against existing codebase
- Pitfalls: HIGH -- glassmorphism visibility and motion import path are well-documented issues
- Code examples: MEDIUM -- motion API patterns verified via docs, but entrance-to-float transition pattern is composed from separate verified features

**Research date:** 2026-03-11
**Valid until:** 2026-04-11 (stable domain, no fast-moving changes expected)
