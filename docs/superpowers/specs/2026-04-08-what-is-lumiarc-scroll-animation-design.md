# WhatIsLumiArc Scroll Animation — Design Spec

**Date:** 2026-04-08  
**File:** `components/panels/WhatIsLumiArc.tsx`  
**Status:** Approved

---

## Goal

Transform the WhatIsLumiArc section from a simple one-shot reveal into a pinned scroll-driven sequence that introduces each pillar (Academic Planning, Financial Aid, Career Prep) one at a time — with a left-panel gradient text sweep and a right-panel card reveal happening in sync.

---

## Layout & Structure

### Left Panel
- Headline (`h1`) remains unchanged.
- Each pillar row (`[data-callout]`) keeps its icon + title + description layout.
- Each pillar's `h3` and `p` get individual element refs so GSAP can target them independently.
- Icons also get per-pillar refs for a parallel opacity animation.
- All pillar text starts in a "dim" gradient state (gray). The headline is fully visible after entry.

### Right Panel
- Replaced by a `relative`-positioned container holding **three absolutely-stacked cards**.
- All three cards share the same bounding box (same size, same position).
- Only one card is visible at a time; `zIndex` + `autoAlpha` control layering.
- Each card: `rounded-2xl`, sky gradient background (`from-sky-300 to-sky-100`), `shadow-lg`, padded content area.

### Gradient Sweep Technique
Applied to each pillar's `h3` and `p` elements:
```css
background: linear-gradient(to right, var(--text-primary) 50%, var(--text-tertiary) 50%);
background-size: 200% 100%;
background-clip: text;
color: transparent;
```
GSAP animates `backgroundPositionX` from `"100%"` (gray showing) → `"0%"` (dark showing).  
This replaces the existing ad-hoc `fill-text` inline gradient styles.

---

## Animation Phases

### Context 1 — Entry Reveal (no pin, no scrub)
**Trigger:** `top 65%`  
Fires once as the section scrolls into view.

1. Headline: clip-path wipe from bottom (`inset(0 0 100% 0)` → `inset(0 0 0% 0)`) + `y: 20 → 0`
2. All three pillar callouts: slide in from left (`x: -40, autoAlpha: 0` → `x: 0, autoAlpha: 1`) with stagger `0.1s`
3. After slide-in, all pillar text is in the dim gray gradient state (initial `backgroundPositionX: "100%"`)
4. All right panel cards remain invisible (`autoAlpha: 0`)

### Context 2 — Pinned Scroll Sequence (scrub)
**Trigger:** `center center`  
**Pin:** `true` (section stays fixed to viewport while scroll consumes extra distance)  
**End:** `+=250%` (2.5× viewport height of scroll space for 3 phases)  
**Scrub:** `1`

Timeline is divided into 3 equal phases:

#### Phase 1 — Academic Planning (0%–28%)
- Pillar 1 icon: `opacity 0.3 → 1`
- Pillar 1 `h3`: `backgroundPositionX "100%" → "0%"` (slightly ahead of description)
- Pillar 1 `p`: `backgroundPositionX "100%" → "0%"`
- Right Panel Card 1: `autoAlpha 0 → 1`, `x: 40 → 0` (slides in from right)
- All run simultaneously; title starts ~0.05 of total phase earlier than description

#### Phase 1 Outro (28%–35%)
- Right Panel Card 1: `autoAlpha 1 → 0`, `x: 0 → -20` (exits left)

#### Phase 2 — Financial Aid Made Simple (35%–63%)
- Pillar 2 icon: `opacity 0.3 → 1`
- Pillar 2 `h3` + `p`: gradient sweep (same as Phase 1)
- Right Panel Card 2: slide in from right, fade in

#### Phase 2 Outro (63%–70%)
- Right Panel Card 2: fade out, exit left

#### Phase 3 — Career Prep Guidance (70%–98%)
- Pillar 3 icon: `opacity 0.3 → 1`
- Pillar 3 `h3` + `p`: gradient sweep
- Right Panel Card 3: slide in from right, fade in

#### Hold (98%–100%)
- Everything visible; section unpins and normal scroll resumes

---

## Right Panel Content

All cards use a header (pillar icon + title) and a bulleted list with `CheckCircle` icons from `lucide-react`.

### Card 1 — Academic Planning
- Know exactly which courses fulfill your degree requirements
- Get alerts before prerequisite chains close off your options
- See your GPA impact before you drop or add a class
- Plan next semester in minutes, not advising appointments

### Card 2 — Financial Aid Made Simple
- Track FAFSA deadlines specific to your school
- See your grants, loans, and aid package in plain language
- Get warned before Satisfactory Academic Progress (SAP) is at risk
- Match with scholarships based on your profile

### Card 3 — Career Prep Guidance
- Know when internship application windows open for your field
- Get a personalized career roadmap based on your major
- Resume and interview prep timed to your graduation date
- Connect to on-campus resources before it's too late

---

## Implementation Notes

- Two `useGSAP` hooks in the same component (scoped to `sectionRef`): one for entry, one for the pin.
- GSAP `backgroundPositionX` tween works on inline styles; text elements need inline `style` props setting the gradient and `backgroundSize` on mount (or set via `gsap.set()` in the hook before the timeline runs).
- `immediateRender: false` on the pinned timeline tweens to prevent them firing before the pin is reached.
- Icons start at `opacity: 0.3` via inline style (not Tailwind, since GSAP needs to own the value).
- Existing `fill-text` class and its inline gradient usage on `h3`/`p` elements is removed and replaced by the new gradient sweep setup.
- No new dependencies — GSAP + ScrollTrigger are already installed.
- After changes: run `npm run build` to confirm zero errors before marking complete.

---

## Files Changed

| File | Change |
|---|---|
| `components/panels/WhatIsLumiArc.tsx` | Full rewrite of animation logic and right panel JSX |
| `app/globals.css` | No changes expected |
