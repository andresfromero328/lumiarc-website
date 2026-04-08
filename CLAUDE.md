# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project Context

This is the **LumiArc landing page** — a Next.js site deployed to Vercel. It is the `landing/` component of the larger LumiArc monorepo. See [utils/lumiArc_ref.html](utils/lumiArc_ref.html) for the full reference design and brand identity.

## Commands

```bash
npm run dev        # Start dev server (Turbopack, default)
npm run build      # Production build — run this to verify zero errors
npm run start      # Start production server
npm run lint       # Run ESLint (NOT run automatically by build in Next.js 16+)
```

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — no `tailwind.config.js`; theme tokens live in [app/globals.css](app/globals.css) under `@theme inline`
- **Animation:** GSAP + `@gsap/react`, Framer Motion, Lenis (smooth scroll)
- **Icons:** lucide-react

## Next.js 16 / Tailwind v4 Differences

These versions have breaking changes from training data. Key differences:

- **Tailwind v4:** Import with `@import "tailwindcss"` (not `@tailwind base/components/utilities`). Theme customization uses `@theme inline { --color-* }` in CSS, not a JS config file. `@apply` still works inside `@layer components`.
- **No `tailwind.config.js`** — all custom tokens are CSS variables in [app/globals.css](app/globals.css).
- **Turbopack** is the default bundler in `next dev`. Use `next dev --webpack` to opt out.
- **`next build` does not lint** — run `npm run lint` separately.
- **ESLint flat config** (`eslint.config.mjs`) — not `.eslintrc.*`.

## Design System

All tokens are defined in [app/globals.css](app/globals.css). Always use semantic Tailwind classes:

| Purpose | Classes |
|---|---|
| Brand | `text-navy-900`, `text-navy-600`, `bg-navy-900`, `text-gold`, `bg-gold` |
| Surfaces | `bg-sky-50`, `bg-sky-100`, `bg-sky-300`, `bg-gold-light` |
| Text | `text-text-primary`, `text-text-secondary`, `text-text-tertiary`, `text-text-inverse` |
| Semantic | `text-success`, `bg-success-light`, `border-warning`, `bg-error-light`, `text-info`, `bg-info-light` |
| Borders | `border-border`, `border-border-hover`, `border-border-focus` |

Never hardcode colors (e.g. `border-amber-400`, `text-red-600`) — use semantic tokens.

Shared component styles (used 3+ times) belong in [app/globals.css](app/globals.css) as `@layer components` utilities. `.nav-link` is an example already defined there.
