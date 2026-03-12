---
phase: 02-profile-card-layout
plan: 03
status: complete
duration: manual implementation
---

# Summary: Profile Card & Page Layout (02-03)

## What Was Built

The left panel was rebuilt with an interactive 3D badge card instead of the originally planned glassmorphism profile card. This delivers a significantly more impressive visual impact.

### Key Components

- **badge-scene.tsx** — Full 3D scene using React Three Fiber with:
  - Vercel tag.glb model (card body, clip, clamp) with custom badge.png overlay
  - Physics-based rope/lanyard simulation (@react-three/rapier)
  - MeshLine lanyard band with texture
  - Draggable card interaction (grab/release)
  - Gentle floating sway animation via physics impulses
  - Mouse-reactive tilt (opposite direction, only when hovering panel)
  - Stencil-buffer rounded corner clipping
  - Subtle clearcoat glare effect on card surface
  - Environment lighting with Lightformers

- **badge-loader.tsx** — Dynamic import wrapper with `ssr: false` for Three.js compatibility

- **page.tsx** — Two-panel layout with:
  - Header: name + role from portfolio data
  - Left panel: 3D badge (600px on desktop)
  - Right panel: terminal placeholder
  - Footer: social links + resume download (ProfileActions)
  - "Interactive 3D Badge — Drag to play" hint text

### Deviations from Plan

- Replaced glassmorphism ProfileCard with interactive 3D badge scene
- Profile info (name, role) moved to header bar instead of card overlay
- Social links and resume download moved to footer (ProfileActions component)
- Used React Three Fiber + Rapier physics instead of motion/framer-motion animations
- Set `reactStrictMode: false` in next.config.ts to prevent WebGL Context Lost

## Requirements Addressed

- LAYOUT-01: Two-panel layout (3D badge left, terminal right) ✓
- LAYOUT-02: Responsive stacking (h-[500px] mobile, lg:h-full desktop) ✓
- LAYOUT-04: Card with rounded corners, floating animation ✓
- PROF-01: Badge image displays user identity ✓
- PROF-02: Name and role displayed in header ✓
- PROF-03: Location data available in portfolio ✓
- PROF-04: Resume download in footer ProfileActions ✓
- PROF-05: Social icons in footer ProfileActions ✓
- ANIM-02: Floating effect via physics-based sway ✓
