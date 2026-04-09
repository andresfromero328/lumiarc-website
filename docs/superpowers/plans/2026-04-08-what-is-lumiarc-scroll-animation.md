# WhatIsLumiArc Scroll Animation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static WhatIsLumiArc reveal with a pinned scroll sequence that sweeps each pillar's text in as a gradient fill and reveals a matching right-panel card.

**Architecture:** Two `useGSAP` hooks on one component — Context 1 fires a one-shot entry reveal, Context 2 pins the section and scrubs through three pillar phases using a single GSAP timeline with proportional time units.

**Tech Stack:** GSAP 3 + ScrollTrigger, @gsap/react `useGSAP`, Tailwind CSS v4, lucide-react

**Spec:** `docs/superpowers/specs/2026-04-08-what-is-lumiarc-scroll-animation-design.md`

---

## Chunk 1: Full Rewrite of `components/panels/WhatIsLumiArc.tsx`

**Files:**
- Modify: `components/panels/WhatIsLumiArc.tsx` (full rewrite)

### Task 1: Update PILLARS data and imports

- [ ] Add `CheckCircle` to lucide-react imports
- [ ] Extend each PILLARS entry with an `items` array (4 strings each — right panel list content)
- [ ] Define `gradientTextStyle` constant outside the component:

```tsx
const gradientTextStyle: React.CSSProperties = {
  background: "linear-gradient(to right, var(--text-primary) 50%, var(--text-tertiary) 50%)",
  backgroundSize: "200% 100%",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  color: "transparent",
  backgroundPosition: "100% 0%",
};
```

### Task 2: Replace ref structure

- [ ] Remove: `calloutsRef`, `visualRef`
- [ ] Add individual named refs as specified (callout1–3, icon1–3, h3_1–3, p1–3, card1–3)
- [ ] Icon refs use `useRef<HTMLDivElement>(null)` — each icon is wrapped in a `div` that GSAP targets for opacity (avoids SVG ref issues)

### Task 3: Rewrite JSX — left panel

- [ ] Bind `headlineRef` to `h1`
- [ ] Each pillar row: `div` bound to `calloutNRef`
- [ ] Inside each row: icon wrapped in `div` bound to `iconNRef` with `style={{ opacity: 0.3 }}`; `h3` bound to `h3_NRef` with `style={gradientTextStyle}`; `p` bound to `pNRef` with `style={gradientTextStyle}`
- [ ] Remove `data-callout` attributes and old `fill-text` inline gradient styles

### Task 4: Rewrite JSX — right panel

- [ ] Replace single placeholder box with `relative h-96` container
- [ ] Three cards, each `absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-300 to-sky-100 shadow-lg p-8` with `style={{ opacity: 0, visibility: "hidden" }}`
- [ ] Each card: header (`div` with icon + `h3`) and `ul` with `li` items using `CheckCircle` (`icon-sm` class)
- [ ] Use `PILLARS[i].items.map()` for list items within each card

### Task 5: Implement Context 1 (entry reveal)

- [ ] `useGSAP` scoped to `sectionRef`, trigger `top 65%`
- [ ] Headline: `fromTo` clip-path wipe + y, duration 0.7, power3.out
- [ ] Callout divs: `fromTo` `x:-40, autoAlpha:0` → `x:0, autoAlpha:1`, stagger 0.1, offset `-=0.4`
- [ ] No right panel animation

### Task 6: Implement Context 2 (pinned scroll)

- [ ] Second `useGSAP` scoped to `sectionRef`
- [ ] Pre-timeline `gsap.set()`: cards `{ autoAlpha:0, x:0, zIndex:1 }`, icons `{ opacity:0.3 }`
- [ ] Timeline with ScrollTrigger: `center center`, pin:true, end:`+=250vh`, scrub:1
- [ ] Phase 1 (0–2.8): `tl.set(card1,{zIndex:2},0)`, icon1, h3_1, p1 (offset 0.3), card1
- [ ] Phase 1 Outro (2.8–3.5): card1 out, `tl.set(card2,{zIndex:2},3.5)`, `tl.set(card1,{zIndex:1},3.5)`
- [ ] Phase 2 (3.5–6.3): same for icon2/h3_2/p2/card2
- [ ] Phase 2 Outro (6.3–7.0): card2 out, raise card3, reset card2
- [ ] Phase 3 (7.0–9.8): same for icon3/h3_3/p3/card3
- [ ] All tweens: `immediateRender: false`; `backgroundPosition` fromTo `"100% 0%"` → `"0% 0%"`

### Task 7: Build verification

- [ ] Run `npm run build` from `lumiarc-website/`
- [ ] Confirm zero errors and zero TypeScript type errors
- [ ] Commit

---

## Key Constraints

- `immediateRender: false` on every Context 2 tween — without it, GSAP applies `from` values at page load before the pin is reached
- `backgroundPosition` shorthand with `fromTo` (not `backgroundPositionX`, not `to()`) — GSAP parses matching `"X% Y%"` strings reliably in fromTo
- Icon opacity target is a `div` wrapper, not the SVG element — avoids forwardRef uncertainty
- `tl.set()` for z-index is scrub-aware (reverses on backward scroll); placed in timeline insertion order so card resets happen in the same frame as the next card's raise
