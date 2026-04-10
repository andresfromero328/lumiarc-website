# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## CRITICAL: Use jcodemunch MCP for Code Navigation

**Always use the `jcodemunch` MCP tools** instead of Glob/Grep/Read whenever the task involves exploring or searching the codebase. This is non-negotiable.

| Task | Use |
|---|---|
| Browse file/folder structure | `jcodemunch__get_file_tree` |
| Read a file | `jcodemunch__get_file_content` |
| Get outline of a file (functions, classes) | `jcodemunch__get_file_outline` |
| Get outline of the whole repo | `jcodemunch__get_repo_outline` |
| Look up a specific symbol | `jcodemunch__get_symbol` / `jcodemunch__get_symbols` |
| Search for a symbol by name | `jcodemunch__search_symbols` |
| Full-text search across files | `jcodemunch__search_text` |
| Index a folder or repo before searching | `jcodemunch__index_folder` / `jcodemunch__index_repo` |

Only fall back to Glob/Grep/Read if a jcodemunch tool is unavailable or returns an error.

## CRITICAL: Use claude-mem MCP for Persistent Memory

**Always use `claude-mem` MCP tools** to read and write project memory across sessions. Do not rely solely on in-context information — check memory at the start of every session and save anything non-obvious that would be useful in the future.

| When | Action |
|---|---|
| Start of every session | Search memory for project context (`claude-mem:mem-search` or `mcp__plugin_claude-mem_mcp-search__smart_search`) |
| After completing significant work | Save decisions, gotchas, and non-obvious findings |
| When user asks "do you remember…" or "did we already…" | Query memory first before answering |
| After resolving a bug or making a key architectural decision | Record it so future sessions benefit |

**Tools available:**
- `mcp__plugin_claude-mem_mcp-search__smart_search` — semantic search across all memories
- `mcp__plugin_claude-mem_mcp-search__get_observations` — fetch specific observations by ID
- `mcp__plugin_claude-mem_mcp-search__search` — keyword search
- `mcp__plugin_claude-mem_mcp-search__timeline` — view session history
- `mcp__plugin_claude-mem_mcp-search__smart_outline` / `smart_unfold` — browse memory structure

**Skills available** (invoke via the `Skill` tool):
- `claude-mem:mem-search` — search memory and surface relevant past context
- `claude-mem:make-plan` — plan a feature with memory-informed context
- `claude-mem:do` — execute a plan using subagents

## Project Context

This is the **LumiArc landing page** — a Next.js site deployed to Vercel. It is the `landing/` component of the larger LumiArc monorepo. See [ref_source/lumiArc_ref.html](ref_source/lumiArc_ref.html) for the full reference design and brand identity.

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
