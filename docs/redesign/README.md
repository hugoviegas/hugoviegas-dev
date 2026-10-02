# hugoviegas.dev redesign

Source: the Claude Design canvas "hugoviegas.dev Redesign" (October 2026), built
on the "Hugo Viegas" design system. This file is the implementation reference.

## Delivery plan (stacked branches)

| Branch | Scope |
| --- | --- |
| `redesign/01-foundation` | Tokens, fonts, Tailwind theme, brick primitives, button variants |
| `redesign/02-navigation` | Floating nav pill with coin markers, mobile bottom pill + section sheet, language flag sequence, LEGO theme switch, spaceship toggle (off by default) |
| `redesign/03-hero` | Profile card, avatar flip (photo / minifigure), desk scene with feathered edge |
| `redesign/04-sections` | New section order; Projects (2 / 3 / carousel), Experience timeline, Skills |
| `redesign/05-about-contact` | About + opt-in story crawl, Contact form states, Footer, Fun Stuff collapse |
| `redesign/06-project-page` | Project detail page layout (Big Bang Duel, D'Arcy McGee's) |

Each branch builds on the previous one. Merge them in order.

## Colour

Flat colours only: no gradients in fills, text, borders, glows or shadows.
The one exception is the alpha mask that feathers the hero scene image.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| background | `#f6f6f6` | `#0b0f12` | Page |
| card (surface) | `#ffffff` | `#13181c` | Cards, nav, inputs |
| surface-2 | `#ededee` | `#1c2227` | Tags, hover fills |
| surface-3 | `#e2e3e5` | `#262d33` | Pressed fills |
| border | `#e4e4e4` | `#262d33` | Hairlines |
| line-strong / input | `#6b6f75` (5.0:1) | `#7c858f` (4.8:1) | Input and outline borders |
| foreground | `#14191d` (16.4:1) | `#eef1f3` (17.0:1) | Headings, body |
| ink-2 | `#3c434c` (9.3:1) | `#c3c9cf` (11.6:1) | Lead lines |
| ink-3 / muted-foreground | `#4d5563` (7.1:1) | `#a3abb3` (8.3:1) | Meta, captions |
| primary | `#067a38` (5.1:1; white on it 5.5:1) | `#3ccf7a` (9.5:1; `#06200f` on it 8.5:1) | Green text, primary fill |
| primary-hover | `#05682f` | `#5ad98e` | |
| primary-pressed | `#04552a` | `#2bb365` | Button base shadow |
| primary-tint | `#e6f3ec` | `#12261b` | Active nav, success |
| primary-tint-2 | `#cfe8da` | `#183424` | Input focus halo |
| brand-decor | `#08ae51` | `#3ccf7a` | Studs, dots. Never text in light theme |
| destructive | `#b42318` | `#ff8a7a` | Errors |
| shadow-hard | `#dcdee1` | `#050708` | Flat offset shadows |
| coin | `#f2b705` / rim `#b8860b` | same | Coin markers only |

## Type

Plus Jakarta Sans for UI and headings; JetBrains Mono only for small uppercase
labels. Display 56 / 48 / 44 / 36 / 32 px at 1440 / 1024 / 768 / 390 / 320.
Section titles 40 / 36 / 32 / 28 / 26. Body 16, small 14, mono label 12.

## Elevation, radius, motion

- Shadows: `shadow-e1` (0 1 0 border), `shadow-e2` (0 3 0), `shadow-e3` (0 5 0), `shadow-btn`.
- Radius: 8 buttons, 16 cards (`rounded-lg`), 24 hero card (`rounded-3xl`), full for pills.
- Durations: fast 120ms, base 200ms, slow 320ms, flip 600ms. Easings: `ease-out`,
  `ease-inout`, `ease-snap` (brick click overshoot).
- Every animation is disabled by the global `prefers-reduced-motion` rule in `src/index.css`.

## Bricks

`src/components/brand/`:

- `IsoBrick` — isometric SVG brick (1x1, 1x2, 2x2, 2x4, plate-2x4) with real
  LEGO proportions: pitch 8u, brick 9.6u, plate 3.2u, stud Ø4.8u × 1.7u.
- `FlatBrick` — front-view brick for small UI (dividers, timeline nodes, badges).
- `CoinMarker` / `NavDot` — active and inactive nav markers.
- `Flags` — GB, IE and BR flags for the language control.
- `BrickLoader` — stacking-bricks loading indicator.

Rules: one to three bricks per screen, always `aria-hidden`, never a navigation
mechanic, two studs on primary buttons only.
