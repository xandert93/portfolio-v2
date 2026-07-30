Framer Motion has different ways to trigger animations:

| Feature       | Purpose                                     |
| ------------- | ------------------------------------------- |
| `animate`     | Runs animation immediately                  |
| `whileInView` | Runs animation when element enters viewport |

# `animate`

`animate` starts as soon as the component mounts.

```jsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

Flow:

```txt
page loads
    ↓
animation starts
```

Use when the animation should happen immediately.

---

# `whileInView`

`whileInView` waits until the element enters the viewport.

```jsx
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} />
```

Flow:

```txt
page loads
    ↓
user scrolls
    ↓
element enters viewport
    ↓
animation starts
```

It is similar to `animate`, but with a viewport trigger.

---

# `viewport`

`viewport` controls the rules for `whileInView`.

Example:

```jsx
<motion.div
  initial={{ y: 50, opacity: 0 }}
  whileInView={{ y: 0, opacity: 1 }}
  viewport={{
    once: true,
    amount: 0.3,
  }}
/>
```

Meaning:

- Wait until 30% of the element is visible
- Run the animation
- Do not run it again

---

# Default `viewport` behaviour

If no `viewport` prop is provided:

```jsx
<motion.div whileInView={{ opacity: 1 }} />
```

It behaves approximately like:

```jsx
viewport={{
  once: false,
  amount: "some",
  margin: "0px"
}}
```

Defaults:

| Property | Default  | Meaning                                             |
| -------- | -------- | --------------------------------------------------- |
| `once`   | `false`  | Animation repeats every time it enters the viewport |
| `amount` | `"some"` | Triggers when part of the element is visible        |
| `margin` | `"0px"`  | No extra trigger area                               |

---

# `viewport` Options

## `once`

Controls whether the animation repeats.

```jsx
viewport={{
  once: true
}}
```

```txt
true:
scroll in → animate → never repeat

false:
scroll in → animate
scroll away
scroll back → animate again
```

---

## `amount`

Controls how much of the element must be visible.

```jsx
viewport={{
  amount: 0.5
}}
```

Examples:

```txt
amount: 0
      → any visibility

amount: 0.5
      → 50% visible

amount: 1
      → fully visible
```

---

## `margin`

Adjusts the viewport detection area.

```jsx
viewport={{
  margin: "-100px"
}}
```

Useful for triggering animations earlier or later.

---

# Common Production Pattern

A common website animation:

```jsx
<motion.div
  initial={{
    opacity: 0,
    y: 20,
  }}
  whileInView={{
    opacity: 1,
    y: 0,
  }}
  viewport={{
    once: true,
    amount: 0.2,
  }}
/>
```

# Motion Notes (Framer Motion)

Notes on when and how to animate a landing page. Written to be read again in 10 years without needing the original context.

## The core rule

**Animation should support hierarchy, not become the experience.**

Every section _can_ animate. Not every section _should_. Ask "does this reveal help the user understand structure or importance?" before adding motion — not "would this look nice?"

---

## `animate` vs `whileInView` vs `variants` — when to use which

| Prop                           | Fires when                                                 | Use for                                                                                                                                 | Don't use for                                                                                           |
| ------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `animate`                      | Immediately on mount                                       | Hero section, anything visible on initial load                                                                                          | Below-the-fold content (wastes the animation — user hasn't scrolled there yet)                          |
| `whileInView`                  | When element enters the viewport                           | Below-the-fold sections, feature blocks, cards                                                                                          | Sticky nav / header that's visible on load — animating it delays perceived interactivity for no benefit |
| `variants` (parent + children) | Whatever trigger the parent uses (`animate`/`whileInView`) | Any group of 3+ related elements (cards, list items, nav links) that should move as a coordinated system, not individually-timed pieces | A single element — variants add indirection with no payoff for one node                                 |
| `whileHover` / `whileTap`      | User interaction                                           | Buttons, links, interactive cards — signals affordance                                                                                  | Static text, decorative elements                                                                        |
| `layout`                       | Automatically, on layout change                            | Reordering lists, expanding/collapsing panels                                                                                           | Anything animating on scroll — different problem, don't mix triggers                                    |

**The mental model:**

```
Hero
  → animate (user sees it the instant the page loads, establishes feel)

Section 2+
  → whileInView (progression as the user scrolls, nothing wasted on unseen content)

Group of siblings within a section (cards, grid items)
  → variants with staggerChildren (coordinated, not independently timed)

Interactive elements
  → whileHover / whileTap (affordance, not page-load choreography)
```

---

## Staggering children — do it with variants, not manual delays

Don't hand-time each card's delay (`delay: 0.1`, `delay: 0.2`, `delay: 0.3`...). Use a parent/child variant pair so the timing is a system, not a pile of magic numbers:

```jsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

;<motion.div
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.2 }}
>
  {cards.map((c) => (
    <motion.div key={c.id} variants={item}>
      {c.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Viewport config

```jsx
viewport={{ once: true, amount: 0.2 }}
```

- `once: true` — almost always correct for a portfolio/landing page. The user doesn't need the page "performing" every time they scroll up and down; they've already seen it.
- `amount: 0.2` — good default (fires when 20% of the element is visible), but **not always right**. Tall sections can trigger too early — a sliver enters the viewport and fires before the section is meaningfully "seen."
  - For tall sections, prefer `margin` over tuning `amount`:
    ```jsx
    viewport={{ once: true, margin: "-100px" }}
    ```
    This delays the trigger until the element is 100px into frame, regardless of how tall it is.

---

## Movement should be subtle

Good default:

```jsx
initial={{ opacity: 0, y: 20 }}
```

Avoid for normal UI:

```jsx
y: 200 // too far, feels like a slideshow transition
rotate: 180 // distracting, unmotivated
scale: 0 // jarring pop-in
```

Small, restrained movement reads as "polished." Large movement reads as "look at me."

---

## What NOT to animate

- Dense text sections / long-form reading content
- Pricing tables (users need to compare, not watch a reveal)
- Forms (motion interrupts task completion)
- Navigation, especially anything sticky and visible on load
- Accessibility-critical content — screen reader / keyboard flows shouldn't depend on motion timing

Also avoid animating **every** element in a section:

```
Good:  heading fades up → key visual appears → cards stagger slightly
Bad:   heading fades → paragraph fades → button fades → card1 → card2 → card3 → footer fades
```

The "bad" version turns the page into a slideshow. One or two deliberate reveals per section beats animating everything in it.

---

## Accessibility: respect `prefers-reduced-motion`

Framer Motion exposes this as a hook. Wire it in once, near the top of the app, rather than per-component:

```jsx
import { useReducedMotion } from 'framer-motion'

const shouldReduceMotion = useReducedMotion()

const variants = {
  hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
  show: { opacity: 1, y: 0 },
}
```

If `shouldReduceMotion` is true, drop positional movement and keep opacity-only transitions (or skip the animation entirely for critical content).

---

## Performance: animate transform + opacity only

Animate `x`, `y`, `scale`, `rotate`, `opacity`. These run on the compositor thread.

Avoid animating `width`, `height`, `top`, `left`, or anything that triggers layout recalculation on every frame — this causes visible jank on lower-end devices, especially on scroll-triggered animations where many elements may be animating near-simultaneously.

---

## Quick reference: the whole decision in one pass

1. Is this above the fold and visible on load? → `animate`, not `whileInView`.
2. Is this a below-the-fold section? → `whileInView`, `once: true`.
3. Is this section unusually tall? → use `margin: "-100px"` instead of tuning `amount`.
4. Is this a group of related siblings (cards, list items)? → `variants` + `staggerChildren`, not manual per-item delays.
5. Is this interactive (button, link, clickable card)? → `whileHover` / `whileTap`, separate from scroll-triggered motion.
6. Is this dense text, a form, pricing, or nav? → don't animate it.
7. Am I animating more than 2 things per section? → cut it down.
8. Am I animating anything other than transform/opacity? → reconsider.
9. Have I wired `useReducedMotion` in once at the top level? → do this before shipping.
