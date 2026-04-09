# WhatIsLumiArc Scroll Animation — Design Spec

**Date:** 2026-04-08  
**File:** `components/panels/WhatIsLumiArc.tsx`  
**Status:** Approved

---

## Goal

Transform the WhatIsLumiArc section into a pinned scroll-driven sequence that reveals each of three pillars (Academic Planning, Financial Aid, Career Prep) one at a time with a gradient text sweep on the left panel and a card reveal on the right panel.

---

## Ref Structure

Use individual named refs:

```tsx
const sectionRef   = useRef<HTMLDivElement>(null);      // existing, kept
const headlineRef  = useRef<HTMLHeadingElement>(null);  // existing, kept

// Per-pillar callout wrapper divs (Context 1 entry targets)
const callout1Ref  = useRef<HTMLDivElement>(null);
const callout2Ref  = useRef<HTMLDivElement>(null);
const callout3Ref  = useRef<HTMLDivElement>(null);

// Per-pillar inner elements (Context 2 scroll targets)
const icon1Ref     = useRef<HTMLElement>(null);   // lucide SVG wrapper
const icon2Ref     = useRef<HTMLElement>(null);
const icon3Ref     = useRef<HTMLElement>(null);
const h3_1Ref      = useRef<HTMLHeadingElement>(null);
const h3_2Ref      = useRef<HTMLHeadingElement>(null);
const h3_3Ref      = useRef<HTMLHeadingElement>(null);
const p1Ref        = useRef<HTMLParagraphElement>(null);
const p2Ref        = useRef<HTMLParagraphElement>(null);
const p3Ref        = useRef<HTMLParagraphElement>(null);

// Right panel cards
const card1Ref     = useRef<HTMLDivElement>(null);
const card2Ref     = useRef<HTMLDivElement>(null);
const card3Ref     = useRef<HTMLDivElement>(null);
```

**Removed:** `calloutsRef`, `visualRef`, `data-callout` attributes.

---

## Layout & Structure

### Left Panel
- Headline `h1` → `headlineRef`.
- Each pillar row is a `div` → `callout1Ref / callout2Ref / callout3Ref` (used for Context 1 slide-in).
- Inside each callout div: icon element → `icon1Ref` etc., `h3` → `h3_1Ref` etc., `p` → `p1Ref` etc.
- **Icon initial state:** `opacity: 0.3` via inline `style` prop at render. GSAP owns this value.
- **Text (h3 + p) initial state:** gradient inline style (see below). GSAP animates `backgroundPosition` only.

### Right Panel
- `relative` container with explicit `h-96` (prevents collapse with all-`absolute` children).
- Three cards: each `absolute inset-0`.
- **Card initial state at render:** inline `style={{ opacity: 0, visibility: "hidden" }}` — invisible before GSAP initializes, no flash.
- `zIndex` managed via `tl.set()` (scrub-aware, reverses on backward scroll):
  - Pre-timeline `gsap.set()`: all cards `{ zIndex: 1 }`
  - At each phase start: raise entering card to `zIndex: 2`
  - At each phase end: reset exiting card to `zIndex: 1` (same timeline position)
- Each card: `rounded-2xl bg-gradient-to-br from-sky-300 to-sky-100 shadow-lg p-8`.
- Card header: pillar icon (same lucide icon as left panel) + pillar `h3` title.
- Card list: `ul > li` with `CheckCircle` (`icon-sm` class) + text per item.
- **Removed:** existing `visualRef` entry animation from Context 1 — entirely replaced by the pinned card sequence.
- **Mobile:** out of scope.

### Gradient Sweep Technique
Inline `style` props on each pillar's `h3` and `p` at render:

```tsx
style={{
  background: "linear-gradient(to right, var(--text-primary) 50%, var(--text-tertiary) 50%)",
  backgroundSize: "200% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",  // Safari
  color: "transparent",
  backgroundPosition: "100% 0%", // GSAP starts here — gray showing
}}
```

CSS variables defined in `globals.css` `:root`: `--text-primary: #1b2a4a`, `--text-tertiary: #8896a6`.

**GSAP animation technique:** Use `fromTo` with `backgroundPosition` shorthand:
```ts
gsap.fromTo(el,
  { backgroundPosition: "100% 0%" },   // gray showing
  { backgroundPosition: "0% 0%", ... } // dark showing
)
```
Use `backgroundPosition` shorthand (not `backgroundPositionX`) with explicit `fromTo` — GSAP CSSPlugin reliably parses and interpolates matching-format strings in `fromTo` without needing to read computed style. Both values must be in `"X% Y%"` format with a fixed Y (`0%`).

---

## Animation Phases

### Context 1 — Entry Reveal
**Trigger:** `top 65%`, fires once, not reversible.

1. Headline: `clipPath: "inset(0 0 100% 0)"` → `"inset(0 0 0% 0)"`, `y: 20 → 0`, `duration: 0.7`, `ease: "power3.out"`
2. Callout wrapper divs (`callout1Ref`, `callout2Ref`, `callout3Ref`):
   `x: -40, autoAlpha: 0` → `x: 0, autoAlpha: 1`, `duration: 0.6`, `ease: "power2.out"`, `stagger: 0.1`
   - Callout divs animate to `autoAlpha: 1`. Icons remain dim at inline `opacity: 0.3`.
3. **Right panel:** not touched.

### Context 2 — Pinned Scroll
**Trigger:** `center center`  
**Pin:** `true`  
**End:** `"+=250vh"` (250% viewport height of scroll distance)  
**Scrub:** `1`  
**pinSpacing:** `true` (default)  
**Backward scrub:** reverses all tween states — intentional.

**`duration: 10` is a proportional scrub unit, not seconds.** GSAP maps scroll progress 0→1 across the pin range proportionally to timeline progress 0→10. Tweens at position `0` fire at pin start; at `10` when section unpins.

**`immediateRender: false` on all tweens is required** — prevents GSAP from applying `from` values on page load before the user scrolls.

**Pre-timeline setup (runs at mount via `gsap.set()`, before ScrollTrigger fires):**
```ts
gsap.set([card1Ref.current, card2Ref.current, card3Ref.current], { autoAlpha: 0, x: 0, zIndex: 1 });
gsap.set([icon1Ref.current, icon2Ref.current, icon3Ref.current], { opacity: 0.3 });
```

#### Phase 1 — Academic Planning (`0` → `2.8`)
```ts
tl.set(card1Ref.current, { zIndex: 2 }, 0)
tl.fromTo(icon1Ref.current,
  { opacity: 0.3 }, { opacity: 1, duration: 2.8, immediateRender: false }, 0)
tl.fromTo(h3_1Ref.current,
  { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 0)
tl.fromTo(p1Ref.current,
  { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 0.3)
tl.fromTo(card1Ref.current,
  { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 2.8, ease: "power2.out", immediateRender: false }, 0)
```

#### Phase 1 Outro (`2.8` → `3.5`)
```ts
tl.to(card1Ref.current, { autoAlpha: 0, x: -20, duration: 0.7, ease: "power2.in" }, 2.8)
tl.set(card2Ref.current, { zIndex: 2 }, 3.5)  // raise card2
tl.set(card1Ref.current, { zIndex: 1 }, 3.5)  // reset card1 — prevents stale stacking on scrub-back
```

#### Phase 2 — Financial Aid Made Simple (`3.5` → `6.3`)
```ts
tl.fromTo(icon2Ref.current,
  { opacity: 0.3 }, { opacity: 1, duration: 2.8, immediateRender: false }, 3.5)
tl.fromTo(h3_2Ref.current,
  { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 3.5)
tl.fromTo(p2Ref.current,
  { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 3.8)
tl.fromTo(card2Ref.current,
  { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 2.8, ease: "power2.out", immediateRender: false }, 3.5)
```
Pillar 1 stays fully lit. Scrub-back reverses it.

#### Phase 2 Outro (`6.3` → `7.0`)
```ts
tl.to(card2Ref.current, { autoAlpha: 0, x: -20, duration: 0.7, ease: "power2.in" }, 6.3)
tl.set(card3Ref.current, { zIndex: 2 }, 7.0)
tl.set(card2Ref.current, { zIndex: 1 }, 7.0)
```

#### Phase 3 — Career Prep Guidance (`7.0` → `9.8`)
```ts
tl.fromTo(icon3Ref.current,
  { opacity: 0.3 }, { opacity: 1, duration: 2.8, immediateRender: false }, 7.0)
tl.fromTo(h3_3Ref.current,
  { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 7.0)
tl.fromTo(p3Ref.current,
  { backgroundPosition: "100% 0%" }, { backgroundPosition: "0% 0%", duration: 2.5, immediateRender: false }, 7.3)
tl.fromTo(card3Ref.current,
  { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 2.8, ease: "power2.out", immediateRender: false }, 7.0)
```

#### Hold (`9.8` → `10`)
No tweens. All pillars fully lit, Card 3 visible. Section unpins.

---

## Right Panel Content

### Card 1 — Academic Planning (`GraduationCap`)
- Know exactly which courses fulfill your degree requirements
- Get alerts before prerequisite chains close off your options
- See your GPA impact before you drop or add a class
- Plan next semester in minutes, not advising appointments

### Card 2 — Financial Aid Made Simple (`Banknote`)
- Track FAFSA deadlines specific to your school
- See your grants, loans, and aid package in plain language
- Get warned before Satisfactory Academic Progress (SAP) is at risk
- Match with scholarships based on your profile

### Card 3 — Career Prep Guidance (`Briefcase`)
- Know when internship application windows open for your field
- Get a personalized career roadmap based on your major
- Resume and interview prep timed to your graduation date
- Connect to on-campus resources before it's too late

---

## Implementation Notes

- Two `useGSAP` hooks, both scoped to `sectionRef`. GSAP handles ScrollTrigger cleanup on unmount automatically.
- `icon-sm` class is defined in `globals.css`: `@apply shrink-0 text-text-secondary size-4;`
- `WebkitBackgroundClip: "text"` included alongside `backgroundClip: "text"` for Safari.
- Lenis + ScrollTrigger coordination: no special handling needed.
- `prefers-reduced-motion`: out of scope.
- After implementation: run `npm run build` to confirm zero errors.

---

## Files Changed

| File | Change |
|---|---|
| `components/panels/WhatIsLumiArc.tsx` | Full rewrite of animation logic and right panel JSX |
| `app/globals.css` | No changes expected |
