# Frontend Discovery Audit

Read-only technical summary of the current frontend, written to brief a new design system.
No code, dependency, config, or content was changed. Facts and open questions only; no designs or fixes are proposed.

- **Baseline:** git `main` at `d47b3d2` plus an **in-progress merge** of `origin/main` (`MERGE_HEAD` `cf96e5b`: PR #24 file uploads and PR #25 content cutover, with one unresolved conflict in `.env.sample`) that landed in the working tree at about 23:00 UTC on 2026-10-01, partway through this audit. Every file touched by that merge was re-read afterwards, so all statements describe the **merged working tree**. If the merge is aborted or completed differently, the content-layer and Hero statements in section 9 are the ones that change. Other uncommitted changes (`.github/`, `.specify/`, line endings) pre-date the audit and were not examined.
- **Method:** source reading plus a regex import-graph scan of `src/` (test files excluded when deciding "unused"). Nothing was built or run. `dist/` is stale (September build) and is not used as evidence.
- **Conventions:** paths are relative to the repo root. `file:N` or `file:N-M` are line numbers in the working tree. "Not found" marks anything the scope asked for that does not exist.
- **Stack (from `package.json`):** React 18.3, Vite 5 (`@vitejs/plugin-react-swc`), Tailwind 3.4 + `tailwindcss-animate`, React Router 6, `next-themes` 0.3, three 0.163, `@react-three/fiber` 8, `@react-three/drei` 9.122, TanStack Query 5, Firebase 12 (admin chunk only). Framer Motion is not installed.

---

## 1. Top bar and navigation

### Files and relationships

| File | Role |
| --- | --- |
| `src/App.tsx:56-59` | Mounts `RouteSeo`, `SkipLink`, `DynamicSidebar`, `TopControls` once, inside `BrowserRouter` but outside `<Routes>`, so they render on every route (home, project pages, archived pages, admin). |
| `src/components/DynamicSidebar.tsx` | The navigation bar: desktop pill, mobile hamburger + panel, Projects submenu, scroll-spy. |
| `src/components/TopControls.tsx` | Fixed top-right pill holding `ThemeToggle` (line 46) and the language button. |
| `src/components/ThemeToggle.tsx` | Animated sun/moon button. Rendered only inside `TopControls`. |
| `src/App.top-bar-global.test.tsx` | Test asserting one navigation, one language button, and one Projects menu on `/`, `/projects/darcy-mcgees`, `/projects/big-bang-duel`, `/projects/big-bang-duel/story`. |

`DynamicSidebar` and `TopControls` share no state and no container. They are two independent `fixed` layers at the top of the viewport:

- Desktop nav: `hidden md:flex fixed top-3 left-4 right-4 z-50 justify-center` (`DynamicSidebar.tsx:376-381`), pill classes `sidebar-glass rounded-full px-3 py-2`.
- Controls: `fixed top-3 left-0 right-0 z-[60] flex justify-end` with `pointer-events-none`, inner pill `pointer-events-auto sidebar-glass rounded-full` (`TopControls.tsx:44-45`).

### Nav items (`DynamicSidebar.tsx:207-224`)

`hero` (label `nav.me`, `isHome`), `experience`, `about`, `projects` (opens a submenu), `contact`. Labels come from `t(...)`.
The Projects submenu has two hard-coded links (`:207-213`): `/projects/big-bang-duel` and `/projects/darcy-mcgees`. They are not driven by Firestore.
Not in the bar: a CV link, a Skills item (Skills renders inside About), and any spaceship toggle (**not found**).

### Active-section behaviour on scroll

- Scroll-spy (`DynamicSidebar.tsx:227-275`) runs only when `location.pathname === "/"`. A passive `scroll` listener is throttled with `requestAnimationFrame`. At `scrollY < 50` the section is `hero`; otherwise it picks the section among `hero|experience|about|projects|contact` with `rect.top <= 200` and the smallest `|rect.top - 100|`. Result is stored in `currentSection` (`:181`).
- What the active state changes: the item's icon swaps from a small grey dot to `gold-coin-2d.webp`, desktop gets `bg-accent/6 ring-1 ring-primary/20` and `text-primary` (`:57-78`), mobile gets `bg-accent/30` (`:30-54`). `isActive = isHomePage && currentSection === item.id`, so nothing is active off the homepage. The `hero` item always shows `/obiwan_face.png` (`public/`, 310.4 KB PNG) instead of a coin.
- **A scroll-updated text "section label" or popup does not exist in the TSX (not found).** CSS remnants exist with no TSX users: `.section-label-enter/-exit` and keyframes `sectionLabelSlideIn/Out` (`src/index.css:1133-1173`), plus `.dynamic-sidebar`, `.sidebar-item`, `.sidebar-icon`, `.sidebar-label`, `.floating-icon`, `.sidebar-hover-scale`, `.sidebar-minimal-container` (grep over `src/**/*.tsx` finds none).
- Navigation actions (`:277-297`): `hero` scrolls to top (or `navigate("/")` off-home); other items scroll to `element.offsetTop - 80` smoothly, or `navigate("/#id")` when the element is missing; `Index.tsx:24-28` then scrolls to the hash.
- `Escape` closes both Projects menus and the mobile menu (`:194-205`).

### Mobile behaviour

- Below `md` the desktop pill is hidden. A hamburger button is `fixed left-2 sm:left-4 top-3 sm:top-4 z-50 md:hidden` (`:302-326`), rotating and scaling when open.
- The panel is `fixed left-2 sm:left-4 top-16 sm:top-20 z-40 md:hidden`, `w-56 sm:w-64`, slides with `-translate-x-full` / `opacity-0` / `pointer-events-none` when closed and sets `aria-hidden` (`:329-373`). Choosing an item closes it.
- Projects on mobile is an inline accordion; on desktop an absolutely positioned dropdown (`:92-174`).
- Both bars fade/slide in after mount via a `mounted` flag (`:180`, `:190-192`).

---

## 2. Language toggle

### State and flow (`src/components/TopControls.tsx`)

- State: `isToggling` (`:9`), `liveFlag` `"BR" | "IE" | "GB"` initialised to `BR` when the language is PT, else `IE` (`:11-13`), `animateGBtoIE` (`:14`). `showFlagTest` (`:15`) is declared and never used.
- `handleToggle` (`:17-41`):
  1. `setIsToggling(true)`, compute the target language, call `toggleLanguage()`.
  2. Target **EN**: `setLiveFlag("GB")` immediately; after **2000 ms** `setAnimateGBtoIE(true)`; after a further **800 ms** `setLiveFlag("IE")` and `setAnimateGBtoIE(false)`.
  3. Target **PT**: `setLiveFlag("BR")` immediately.
  4. After **150 ms** `setIsToggling(false)`.
- `isToggling` only disables the button (`disabled={isToggling}`) and adds `opacity-85` for 150 ms (`:51-54`). It is not tied to the flag animation, which runs 2.8 s after an EN switch.
- None of the timeouts are stored or cleared (no cleanup on unmount or on a second click). By reading the code (not reproduced in a browser): clicking EN then PT within about 2 s leaves the first click's timers running, so they can set the flag to `IE` while the language is PT.
- The label next to the flag shows the language code `EN`/`PT` (`:75-77`). The `aria-label` is a hard-coded English string, `Switch to Portuguese|English` (`:55-57`), and the test above queries it.

### The effect to preserve

On switching to English: show the **GB** flag, hold it 2 s, play a **shake** (400 ms) followed by a **scale-up + fade-out** (400 ms, delayed 400 ms), then swap to the **IE** flag. Switching to Portuguese just swaps to BR with no animation.

CSS (`src/styles/components.css`):
- `.tp-twemoji-live`: 28×28, `object-fit: contain`, `transition: transform 160ms, opacity 160ms` (`:56-61`). The `<img>` also carries `width={22} height={16}` attributes (`TopControls.tsx:71-72`); the CSS size applies.
- `.tp-explode`: `animation: tp-shake 400ms ease-in-out, tp-explode-fade 400ms ease-in-out 400ms forwards` (`:64-67`).
- `tp-shake`: keyframes translateX −6/+6/−4/+4/0 px with rotate −6/+6/−4/+4/0 deg (`:69-88`). `tp-explode-fade`: opacity 1→0, scale 1→1.6 (`:90-99`).
- The 800 ms JS timeout equals the 400 ms + 400 ms CSS sequence; removing the class after the swap resets opacity and scale.

### Flag assets

- **Twemoji 14.0.2 SVGs loaded from `cdn.jsdelivr.net`** (`TopControls.tsx:64-68`): `1f1e7-1f1f7.svg` (BR), `1f1ee-1f1ea.svg` (IE), `1f1ec-1f1e7.svg` (GB). Remote, not bundled.
- Local flag SVG/raster assets: **not found** in `src/assets/` or `public/`.
- `src/config/languages.ts` stores emoji strings (`🇺🇸` for EN, `🇧🇷` for PT) that `TopControls` does not render. The `.tp-flag` emoji-font helper (`components.css:43-51`, `:102-112`) has no TSX users.

### Language state

`src/hooks/useLanguage.tsx` is the active implementation: a module-level global with a listener `Set`, not a React Context. It reads `localStorage["language"]` at import (`:9-16`), writes it on change (`:33-40`), and sets `document.documentElement.lang` to `pt-BR` or `en` (`:19-23`).
`src/contexts/LanguageContext.tsx` and `src/hooks/useLanguageHook.ts` form a second, unused implementation (see section 8).

---

## 3. Theme handling and design tokens

### How light/dark is stored and applied

- `src/App.tsx:51`: `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>` from `next-themes`. No `storageKey` override, so the library default storage key applies. The provider puts `class="dark"` or `class="light"` on `<html>`.
- `tailwind.config.ts:5`: `darkMode: ["class"]`.
- `index.html` has no inline pre-hydration theme script (grep finds no theme/dark/light handling), so first paint relies on the `:root` defaults, which are the dark values.
- `src/components/ThemeToggle.tsx:9-14`: reads `theme` (not `resolvedTheme`), toggles `light` ↔ `dark`, and `isDark = theme === "dark"`. When the stored or initial value is `system`, `isDark` is false.
- Toggle visuals are pure CSS in `src/styles/components.css:34-263` (classes prefixed `tp-`): a 36 px `.tp-toggle` containing a 28 px round `.tp-slider`; a sun (14 px `#ffd700` circle with glow, 8 rotating rays, `tp-rotate-rays` 20 s infinite) and a moon (16 px `#c7c7c7` with three craters). `.tp-light` / `.tp-dark` swap opacity and scale using `var(--duration-base)`. The slider uses linear-gradient backgrounds (`:229-236`).
- Components also read the theme directly: `BackgroundXWing.tsx:738-742` observes `class`/`data-theme` changes on `<html>`; many styles use `.light ...` selectors (for example `index.css:184`, `:941`, `:1025`).

### Token layers

Stylesheet order: `src/index.css:10` imports `src/styles/index.css`, which imports `design-tokens.css`, `theme-tokens.css`, `components.css` (`components.css:2` imports `design-tokens.css` again), then Tailwind layers.

**Layer A: semantic HSL variables** (`src/styles/theme-tokens.css`, channel triplets consumed as `hsl(var(--x))` by Tailwind). Dark values live on `:root, :root.dark` (`:11-63`); `.light` overrides (`:65-102`).

| Token | Dark | Light |
| --- | --- | --- |
| `--background` | 220 13% 10% | 0 0% 100% |
| `--foreground` | 210 40% 98% | 221 39% 11% |
| `--card` / `--popover` | 217 33% 17% / 221 39% 11% | 0 0% 100% / 0 0% 100% |
| `--primary` | 174 100% 42% (cyan-teal, `#00D4AA` per token comment) | 174 100% 27% |
| `--primary-foreground` | 221 39% 11% | 0 0% 100% |
| `--secondary` | 262 83% 67% (purple) | 262 70% 52% |
| `--brand-accent` | 120 100% 60% (neon green) | 120 70% 30% |
| `--muted` / `--muted-foreground` | 217 33% 17% / 215 14% 65% | 210 40% 96% / 215 20% 40% |
| `--accent` | 217 33% 24% | 210 40% 94% |
| `--destructive` / `--success` / `--warning` | 0 84% 60% / 142 76% 45% / 45 93% 58% | 0 72% 45% / 142 71% 32% / 38 92% 40% |
| `--border` / `--input` / `--ring` | 215 25% 27% / 215 25% 27% / 174 100% 42% | 214 32% 88% / 214 32% 88% / 174 100% 27% |
| `--radius` | 0.75rem | (inherits) |
| `--sidebar-*`, `--chart-1..5` | defined | `--sidebar-*` overridden; `--chart-*` has no light override |

**Layer B: raw design tokens** (`src/styles/design-tokens.css`, a separate `--color-*` family):
- Colour: base white/black, neutral scale 50-950, brand primary `174 100% 42%`, secondary `262 83% 67%` (`#8B5CF6`), accent `120 100% 60%` (`#39FF14`), warning, error, success; semantic text/bg/border/interactive/glass tokens; **three gradient tokens** `--color-gradient-primary|accent|subtle` (`:67-82`). `.light` overrides at `:86-110`.
- Spacing: `--space-1…32` (4 px base) plus layout/component aliases (`:116-143`).
- Typography: font families, sizes `xs…9xl`, weights, line heights, letter spacing, and shorthand text styles (`:149-217`).
- Radius scale `--radius-none…full` (`:223-233`). This is a different scale from the Tailwind `--radius`.
- Shadows `--shadow-xs…2xl`, glass shadows, neon glows (`:239-260`). Motion durations 150/300/500/700 ms, easings, transitions (`:266-288`). Z-index scale (`:294-308`). Breakpoints (`:314-320`). Component tokens for buttons, inputs, cards, nav, modal (`:326-351`).

The two layers overlap (for example dark page background is `220 13% 10%` in both `--background` and `--color-bg-primary`; `--radius` vs `--radius-*`) and are not derived from each other.

**Tailwind mapping** (`tailwind.config.ts`):
- Colours: `border, input, ring, background, foreground, primary, secondary, destructive, muted, accent, brand-accent, success, warning, popover, card, sidebar` all map to `hsl(var(--…))` (`:23-74`).
- Radius: `lg = var(--radius)` (0.75rem), `md = calc(var(--radius) - 2px)`, `sm = calc(var(--radius) - 4px)` (`:75-79`).
- Fonts: `sans` and `inter` = Inter stack, `mono` = JetBrains Mono (`:18-22`). Screens: `xs: 480px`; container centred, padding 2rem, `2xl: 1600px`, `3xl: 1920px`.
- Keyframes/animations registered (`:83-178`): accordion, fade-in, slide-up/left/right, scale-in, float, glow, blink; a `typewriter` keyframe exists (no TSX usage found).
- Plugins: only `tailwindcss-animate` (`:181`). `@tailwindcss/typography` is a devDependency but is not registered, while `BigBangDuelStoryPage.tsx` uses `prose prose-invert …` classes.

### Fonts

Loaded from Google Fonts in `index.html:11-16`: Inter 300-700, JetBrains Mono 400-600, News Cycle 700, Pathway Gothic One. Inter is applied on `body` (`index.css:21`, `font-inter`). JetBrains Mono is used in the hero greeting and role. Pathway Gothic One and News Cycle appear only in the opening-crawl overlay (`index.css:563`, `:700`, `:789`).

### Shared surface classes (`src/index.css`)

In `@layer components`: `.section-wrapper`, `.section-wrapper-wide`, `.section-shell` (`:46-58`); `.glass-card` (`:66`), `.glass` (`:72`), `.glass-strong` (`:76`), `.pill-glass, .sidebar-glass` (`:82-85`); `.card-project`; `.heading-hero` (`:100`, uses `--color-gradient-primary` as text fill), `.heading-section`, `.heading-card`, `.body-text`, `.caption-text`, `.text-gradient` (`:124`); `.fade-in`, `.slide-up`.
Outside the layer: a second `.sidebar-glass` (`:1059-1065`) using `background: var(--color-glass-bg)`, `border: 1px solid var(--color-glass-border)`, `box-shadow: var(--shadow-glass)`, plus `.sidebar-glass-hover` using `hsl(var(--color-glass-bg) / 0.9)`.

### Other colour values outside tokens

Hard-coded hex/rgba in `components.css` (sun `#ffd700`, moon `#c7c7c7`, crater and glow rgba); the crawl overlay uses `#000` and `#feda4a` (`index.css:560-562`); `AboutSection.tsx` highlight styles use Tailwind palette colours such as `text-green-400`, `text-blue-400` (`:32-60`); `ChatBot.tsx:265` uses `red-500/red-600`.

### Gradients in use today

`--color-gradient-primary` (hero heading, `.text-gradient`), the toggle slider (`components.css:229-236`), the hero photo overlay `bg-gradient-to-br from-primary/20 to-secondary/20` (`HeroSection.tsx:267`), the ChatBot launcher glow (`ChatBot.tsx:265`).

### Reduced motion

A global rule shortens all animation and transition durations to 0.01 ms under `prefers-reduced-motion: reduce` (`index.css:28-35`). `src/hooks/use-reduced-motion.ts` exposes the same query to components.

---

## 4. Starship background

The repo has two separate starship implementations. The one the homepage actually renders is **not** the `StarshipBackground` folder.

### 4a. What the homepage renders: `BackgroundXWing`

| Item | Evidence |
| --- | --- |
| Component | `src/components/background/BackgroundXWing.tsx` (802 lines, 23.6 KB) |
| Mounted by | `src/pages/Index.tsx:13-15` (`React.lazy`), rendered at `:33-37` inside `<Suspense fallback={null}>`, only when `!prefersReducedMotion` |
| Libraries | `@react-three/fiber` `Canvas`/`useFrame`/`useThree`, `@react-three/drei` `useGLTF`, `three` |
| Model | `@/assets/3d-model/Lego-glb-models/X-wing.glb?url` (`:25`), **936.9 KB** |
| Preload | `useGLTF.preload(XWING_ASSET_PATH)` runs at module load (`:29-31`), so the model request starts as soon as the lazy chunk loads |
| Canvas | `className="pointer-events-none fixed inset-0 z-[4]"` `aria-hidden` (`:755-759`); `camera={{ position: [0, 1.5, 6], fov: 45 }}`, `gl={{ alpha: true, antialias: true }}`, `dpr={[1, 1.6]}`; `events.disconnect()` on create (`:760-774`) |
| Lights | `ambientLight 0.55`, `directionalLight [6, 8, 4] 0.85` (`:775-776`) |
| Ship | `XWingFlight` (`:181-472`): one X-wing, random diagonal pass edge to edge at `zDepth = -6`, `speed 2.05 ± 0.85`, bob and bank, one barrel-roll per pass triggered at 35-60 % progress, respawns when progress passes 1.05. Defaults at `:709-718`; `Index.tsx` passes no props |
| Helper code | `useViewportSizeAtDepth` (`:130-140`), `getBackgroundColorInfo` / `applyClearColorFromElement` (`:81-128`), global `STAR_CACHE` on `globalThis.__XP_STAR_CACHE` (`:42-54`) |
| Theme sync | `MutationObserver` on `<html>` `class`/`data-theme` plus `prefers-color-scheme` listener; `showStars` is true when the container's computed background luminance is below 0.32 (`:724-752`, `:733`) |

Lazy-loading behaviour:
- The chunk is requested when `Index` renders (not on idle, scroll, or visibility). It loads on every visit to `/` unless reduced motion is requested.
- `vite.config.ts:114-150` (`manualChunks`) places `three`, `@react-three/fiber`, `@react-three/drei` in a `vendor-r3f` chunk (`:141`); the same function routes `/src/assets/3d-model/` modules to `chunk-3d-models` (`:149`). `vite.config.ts:92` adds `**/*.glb` to `assetsInclude`.
- `usePrefersReducedMotion` returns `true` when `matchMedia` is unavailable (`use-reduced-motion.ts:5-9`), in which case the background is skipped.

Performance and fallback logic present in this component: `dpr` capped at 1.6; frames skipped while `document.hidden` (`pauseWhenHidden`, `:326-328`); reduced-motion gate in `Index.tsx`; `Suspense` with a `null` fallback.
**Not found** in this component or in `Index.tsx`: an error boundary, a WebGL-support check, a mobile/low-power branch (no `isMobile`), FPS-based degradation, or a pause when the tab is not visible beyond the hidden-document check.

User toggle: **none**. No control exists in `TopControls`, `DynamicSidebar`, or elsewhere; no `localStorage` key stores a preference.

### 4b. `src/components/StarshipBackground/` (demo route only)

Only importer: `src/pages/StarshipDemo.tsx:2-3`, routed at `/starship-demo` (`App.tsx:26`, `:64`), flagged `noindex` in `src/config/seo.ts:66-70`.

| File | Size | Purpose / use |
| --- | --- | --- |
| `index.tsx` | 26.0 KB | Main component: `Canvas` (camera `[0,0,8]`, fov 60, `antialias`, `alpha`, `zIndex -1`, `:521-523`), wraps in `StarshipErrorBoundary` (`:512`), loads GLBs with `useLoader(GLTFLoader, modelPaths)` (`:430`), mobile check `window.innerWidth < 768` caps ships at 3 and swaps to mobile configs (`:381-385`), defines its own inline `DebugOverlay` (`:237`) and an editor/debug panel |
| `useStarshipAnimation.tsx` | 14.1 KB | Hook: spawn/remove/update ship instances; adaptive concurrency from FPS and `performance.memory` (80 MB limit constant at `:46`) |
| `StarshipModel.tsx` | 2.2 KB | Renders a clone of the GLB scene when provided, else a coloured `BoxGeometry` fallback |
| `StarshipErrorBoundary.tsx` | 2.5 KB | Error boundary with an inline-styled red monospace fallback |
| `starshipConfigs.ts` | 2.7 KB | Two configs: `x-wing` (936.9 KB GLB) and `micro-falcon` (**13,830 KB GLB**), plus `getMobileOptimizedConfigs()` (scale ×0.7) |
| `types.ts`, `utils.ts`, `configUtils.ts`, `performanceUtils.ts`, `modelUtils.ts` | 8.9 / 10.1 / 9.5 / 7.5 / 0.4 KB | Types, config validator, import/export of configs, `PerformanceMonitor`, `preloadStarshipModels` |
| `DebugControls.tsx`, `DebugOverlay.tsx` | 9.1 / 4.0 KB | No non-test importer |
| `__tests__/` | 10 files | Vitest suites for the above |

Importer status inside the folder: `performanceUtils.ts` and `utils.ts` are imported only by tests; `configUtils.ts`, `modelUtils.ts`, `DebugControls.tsx`, `DebugOverlay.tsx` have no importer at all.

### 4c. Related starship viewers

- `src/components/starships/AnimatedStarshipViewer.tsx` (R3F canvas, drei `Environment preset`, `OrbitControls`, `IntersectionObserver`, reduced-motion hook): used by `MicroFalconViewer` (lazy in `WidgetsSection`) and by the unreferenced `XWingViewer`.
- Duplicate model files: `public/3d-model/Lego glb models/X-wing.glb` and `Micro Millennium Falcon.glb` are byte-identical to the `src/assets/3d-model/Lego-glb-models/` copies; no code references the `public/` copies (grep). `public/3d-model/Star Wars - Lightsabers.glb` (8,572.5 KB) is referenced by `HeroLightsaber.tsx:314` and `LightsaberViewerMV.tsx:810`.

---

## 5. Star field and planets

| Visual | Rendered by | How it is made |
| --- | --- | --- |
| WebGL star field | `StarField` in `background/BackgroundXWing.tsx:480-596` | `THREE.Points`, **220** points, positions random in a box of `viewport.width × 1.55` by `viewport.height × 1.45` at depth `zDepth - 4 = -10` (± −6…+4). Per-star base brightness 0.35-0.85, phase, speed 0.45-1.4, amplitude 0.18-0.45; grey vertex colours recomputed on the CPU every frame (`:544-568`). `pointsMaterial size 0.07`, `sizeAttenuation`, additive blending, `depthWrite false` (`:586-593`) |
| WebGL planets | `MiniPlanets` in the same file, `:612-707` | **5** `sphereGeometry [1, 16, 16]` meshes with `meshStandardMaterial` (no textures): hue 0.55-0.72, saturation 0.35-0.58, lightness 0.32-0.52, emissive = colour × 0.35 at intensity 0.8, scale 0.09-0.18, depth −11 (± −3.5…+2.5); rotate on Y and bob (`:665-678`) |
| Generation and persistence | `STAR_CACHE` (`:42-54`, `:491-539`, `:620-661`) | `Math.random` once, then cached on `globalThis` under keys `stars:<depth>:<count>` and `planets:<depth>:<count>`. The key does not include viewport size, so a remount reuses the first layout |
| Visibility | `show={showStars}` (`:778-779`) | Shown only when the container's computed background luminance is < 0.32 (see section 4a) |
| CSS star field (crawl overlay) | `.star-wars-starfield` (`index.css:566-594`) with keyframes `sw-starfield-one/-two` (`:834-850`) | Layered `radial-gradient` dots at several tile sizes, drifting for 120 s / 160 s. Rendered by `StarWarsCrawlOverlay` (`StarWarsCrawl.tsx:398`) only while the overlay is open (opened from About) |
| Hero blobs | `HeroSection.tsx:127-131` | Three blurred circles (`bg-primary`, `bg-secondary`, `bg-accent`) with `.subtle-pulse` (`index.css:245`); not stars, but a background layer |

`StarshipBackground/` (4b) contains no star field or planets.

---

## 6. LEGO blocks and buttons

All LEGO visuals are **raster image assets**. No brick is drawn with SVG, canvas, or CSS shapes.

### `LegoButton` (`src/components/LegoButton.tsx`)

- Image-based. The brick is a CSS background: `brickColor` `"blue"` (default) or `"yellow"` picks `blue-front.webp` or `yellow-front.webp`, passed as inline custom properties `--lego-bg`, `--lego-bg-size`, `--lego-bg-repeat`, `--lego-bg-position` (`:43-51`). `.btn-lego` consumes them with `!important` overrides (`index.css:1327-1385`); the CSS fallback is `url("/src/assets/lego-bricks/blue-front.webp")` (`:1337-1340`).
- Sizes: `min-width/min-height` 200×60 px, 180×54 px (≤640 px), 220×66 px (≥1024 px) (`:1344-1345`, `:1429-1443`). White 600-weight text with text-shadow, `drop-shadow` filter, hover lift, `focus-visible` outline.
- Hover explosion: 12 `<img>` children from five assets (`red-front`, `yellow-front`, `blue-front`, `white-front`, `gold-coin-2d`; `:5-12`) inside `.btn-lego-explosion`, revealed by `.btn-lego-wrapper:hover` (`index.css:1387-1425`). Random offsets are computed in the render body, so they change on every re-render.
- Used by: `HeroSection.tsx:154-159` (two), `ProjectsSection.tsx:262-270`, `ContactSection.tsx:415-428`.

### `TopBricksRow` (`src/components/TopBricksRow.tsx`)

- Image-based: cycles four front-face webp assets (`red`, `white`, `yellow`, `blue`), each rotated 180° with an inline transform (`:92-107`).
- Count: `ceil(100 / 6) = 17` bricks on desktop, `ceil(100 / 8) = 13` on mobile (`:16-22`); the row is `150%` (desktop) or `260%` (mobile) wide inside an `overflow: hidden` absolute container (`:37-73`).
- Entrance: `.animate-top-fall` (1.2 s, `index.css:992-1013`) staggered by `index × 0.12 s`; `.top-brick` is opacity 0.3 (0.4 light, 0.4/0.5 on mobile) (`:1015-1040`).
- Rendered once in `Index.tsx:38` (home only). Positioning, sizing, and the row layout are inline `style` objects, not Tailwind classes.

### Other brick visuals

| Visual | File | Assets / behaviour |
| --- | --- | --- |
| Ambient bricks | `AmbientDots.tsx` (lazy, `Index.tsx:34` passes `count={18}`) | Random position, size 2.5-10 vw (×1.6 on mobile), images `red-front`, `red-top`, `white-front`, `white-top`, `yellow-front` (`:20`); entrance `animate-top-fall` or `animate-fall-bounce`, then `.idle-sway`; container uses `mix-blend-mode: screen` (`multiply` in light) (`index.css:~175-190`). Despite the name it renders bricks; the `.ambient-dot` CSS has no TSX user |
| Hero photo explosion | inline `HeroBrickExplosion` in `HeroSection.tsx:80-122` | 10 `<img>` from 10 assets (all four fronts, three tops, three gold-coin variants); hover on `.hero-image-wrapper` (`index.css:1446-1540`) |
| Project card explosion | inline `BrickExplosion` in `ProjectsSection.tsx:182-238` | 28 `<img>` per card from the same 10 assets; hover or `focus-within` on `.project-wrapper` (`index.css:421-545`); plus two decorative bricks (`red-front`, `yellow-front`) on each card (`:163-174`) |
| Nav markers | `DynamicSidebar.tsx` | `gold-coin-2d.webp` for the active item and the Projects item; `/obiwan_face.png` for Home |
| Experience | `ExperienceSection.tsx:12` | `gold-coin-2d.webp` as `coinIcon` |
| About | `AboutSection.tsx:14-17`, `:58-59` | Four front bricks positioned decoratively |
| ChatBot launcher | `ChatBot.tsx:12`, `:266-267` | `red-front.webp` behind the chat icon |

Both inline explosion components are declared inside their parent component's body, so a new component type is created on every parent render and their random values are regenerated.

### LEGO assets

Used (`src/assets/lego-bricks/`, all webp): `blue-front` 4.4 KB, `red-front` 3.8 KB, `white-front` 2.8 KB, `yellow-front` 3.2 KB, `red-top` 8.6 KB, `white-top` 7.2 KB, `white-top-single` 1.9 KB, `gold-coin-2d` 8.5 KB, `gold-coin-front` 4.8 KB, `gold-coin-top` 7.6 KB.
Other bundled: `public/obiwan_face.png` 310.4 KB (nav Home item).
Present but with no reference found (grep of `src/`, `index.html`): `src/assets/lego-bricks/` `gold-coin-model.gltf` 53.0 KB, `heaad-me.png` 242.8 KB, `mini-boneco.png` 135.0 KB, `red-block-3d.png` 439.7 KB, `red-block-top.png` 544.4 KB, `tony-stark-head.png` 192.3 KB, `yellow-top.png` 318.1 KB; `public/gold-coin-top.png` 410.1 KB, `public/obiwan_minifig.png` 263.3 KB.
CSS with no TSX user: `.lego-square`, `.lego-content` (`index.css:360-410`).

---

## 7. Components rendered on the home page and project pages

Routes (`src/App.tsx:19-29`, `:62-74`): `/` (`Index`, eager), and lazy `/lightsaber`, `/starship-demo`, `/micro-falcon`, `/formula-d`, `/projects/darcy-mcgees`, `/projects/big-bang-duel`, `/projects/big-bang-duel/story`, the admin route (`ADMIN_PATH` from `src/config/admin.ts`), and `*` (`NotFound`, eager).

### Shell on every route

| Component | Purpose | Motion / WebGL / canvas / heavy assets |
| --- | --- | --- |
| `ui/toaster` (Radix toast), `ui/sonner`, `ui/tooltip` provider | Toast and tooltip infrastructure | none |
| `RouteSeo` | Sets per-route head metadata from `src/config/seo.ts` | none |
| `SkipLink` | Skip-to-content link | none |
| `DynamicSidebar` | Navigation bar (section 1) | CSS transitions; scroll listener |
| `TopControls` + `ThemeToggle` | Theme and language controls (sections 2-3) | CSS animations (rotating sun rays, flag shake/fade); Twemoji SVGs from jsDelivr |

### Home page (`src/pages/Index.tsx`), in render order

| Component | Purpose | Motion / WebGL / canvas / heavy assets |
| --- | --- | --- |
| `AmbientDots` (lazy) | 18 decorative falling bricks across the viewport | CSS entrance + infinite `idle-sway`; `mix-blend-mode`; webp bricks |
| `BackgroundXWing` (lazy, skipped for reduced motion) | Full-viewport flying X-wing, stars, planets | **WebGL / three.js**, 936.9 KB GLB, `vendor-r3f` chunk, per-frame star colour updates |
| `TopBricksRow` | Row of falling bricks along the top edge | CSS `top-fall` animation; webp bricks |
| `ChatBot` (lazy) | Floating chat launcher (bottom-right) and panel backed by `src/lib/chatbot-service.ts` | CSS `animate-ping` on the launcher while closed (`ChatBot.tsx:272`); 10 s interval while the panel is open (`:82-85`) |
| `HeroSection` (wrapper `div#hero`, `Index.tsx:47`) | Greeting, name, role, description, two `LegoButton` CTAs, social links, CV dialog with PDF iframe, profile photo | Blurred pulsing blobs (`subtle-pulse`); hover brick explosion; `animate-bounce` scroll arrow; `LazyImage` (priority); CV PDF iframe (URL from `settings/site.cv`, else a Vercel Blob fallback); photo from `settings/site.profilePhoto` (Blob), else the bundled webp |
| `ExperienceSection` (`#experience`) | Work and education timeline, certifications and focus lists, expandable cards | `animate-in fade-in` on expanded lists |
| `AboutSection` (`#about`) | About summary and highlights, embeds `SkillsSection`, opens the crawl overlay | none on the section itself |
| `SkillsSection` (inside About; no id of its own) | Skills grouped by category with inline SVG icons | none |
| `StarWarsCrawlOverlay` (inside About, on demand) | Portal overlay that scrolls the full story as an opening crawl | CSS crawl and drifting CSS star field; Pathway Gothic One / News Cycle fonts |
| `ProjectsSection` (`#projects`) | Two-column grid of project tiles and a `LegoButton` CTA | 28-brick hover explosion per tile |
| `ContactSection` (`#contact`) | Contact form (manual validation, POST to `api.web3forms.com`), social links, `LegoButton` submit | `animate-pulse` status dot |
| `WidgetsSection` (lazy, no id) | "Fun Stuff" grid of four cards, always expanded | see rows below |
| `WorldClocks` (in Widgets) | World clocks | 1 s `setInterval` |
| `FastTransparentCube` (in Widgets; statically imported by it) | Interactive Rubik's cube with an expand overlay | Injects `/vendor/animcube/AnimCube3.js` (75.8 KB) at mount; canvas; portal |
| `MicroFalconViewer` (in Widgets; lazy + `IntersectionObserver`, 200 px margin) | Millennium Falcon viewer | **WebGL / R3F**, drei `Environment`, `OrbitControls`, **13,830 KB GLB** |
| `HeroLightsaber` (in Widgets; lazy + `IntersectionObserver`) | Lightsaber viewer | Loads `@google/model-viewer` from `unpkg.com` at runtime (`HeroLightsaber.tsx:20`, `:29`); **8,572.5 KB GLB** from `public/` |
| `Footer` | Social links, copyright | `animate-pulse` heart |

### Project pages (all lazy; none render `TopBricksRow`, `AmbientDots`, or the WebGL background)

| Page | Purpose | Notes |
| --- | --- | --- |
| `pages/DarcyProject.tsx` | Detail page for D'Arcy McGee's: title/summary and stack from `projectDetails`, demo iframe, open-full and back buttons, embedded project ChatBot with suggested questions, `Footer` | Iframe of `VITE_DEMO_DARCY_URL` or `https://demo-darcy.hugoviegas.dev` with a `sandbox` attribute; `ChatBot` is statically imported here (it is lazy on the homepage); no `<img>` found |
| `pages/BigBangDuelProject.tsx` | Detail page for Big Bang Duel: stack, "try" / "built" / "challenges" sections, phone-ratio game iframe (390/844) with loading and failure states, story and back buttons, embedded ChatBot, FAQ accordion, tech list, `Footer` | Iframe of `VITE_DEMO_BIG_BANG_DUEL_URL` or `https://duel.hugoviegas.dev`; `ChatBot` statically imported; no `<img>` found |
| `pages/BigBangDuelStoryPage.tsx` | Long-form story: fixed back pill, title/intro, buttons, article body | Story markdown from `projectDetails` is converted to HTML by an in-file renderer (`renderMarkdown`) and injected with `dangerouslySetInnerHTML`; uses `prose prose-invert` classes |

### Other routes (all `noindex` in `src/config/seo.ts`)

`/lightsaber` → `LightsaberViewerMV.tsx` (29.5 KB); `/micro-falcon` → `MicroFalcon.tsx`; `/starship-demo` → `StarshipDemo.tsx`; `/formula-d` → `FormulaD.tsx` (71.9 KB) with `pages/formulad/*`; admin → `pages/admin/*` (Firebase SDK in its own chunk).

### Section order on the page

`Hero, Experience, About (with Skills), Projects, Contact, Widgets (Fun Stuff), Footer` (`Index.tsx:46-66`).

---

## 8. Dead, empty, and unreferenced files

Method: regex import graph over `src/` (static `import`, `import()`, `lazy`), tests excluded. Files imported only by `vite.config.ts` or by the browser (for example `public/`) are checked separately. Treat the `ui/` list as approximate.

### Empty files (0 bytes)

| Path | Note |
| --- | --- |
| `src/components/CubeModal.tsx` | No importer; its contract test is also empty |
| `src/components/HeroBrickExplosion.tsx` | No importer; the explosion is defined inline in `HeroSection.tsx:80-122` |
| `src/lib/viewer-rotation.ts` | No importer; its contract test is empty |
| `src/pages/Bricks.tsx`, `src/pages/LDraw.tsx` | No importer, no route |
| `src/pages/formulad/FinishedView.tsx`, `RacingView.tsx`, `SetupView.tsx`, `StartingPhaseView.tsx` | No importer |
| `src/types/three-examples.d.ts` | Empty declaration file |
| `src/assets/skills/*.svg` (10 files: css, html, javascript, lucide, nodejs, radix, react, tailwindcss, threejs, typescript) | All 0 bytes, none referenced |
| Empty tests | `src/components/LightsaberViewer/__tests__/BricksViewer.integration.test.tsx`, `src/components/__tests__/ContactSection.contract.test.tsx`, `CubeModal.contract.test.tsx`, `HeroSection.contract.test.tsx`, `SkillsSection.contract.test.tsx`, `src/lib/__tests__/viewerRotationController.contract.test.ts` |
| Repo root (Next.js leftovers) | `config/translations.ts` (0 B) and `contexts/LanguageContext.tsx` (0 B); `app/layout.tsx` (371 B) and `pages/_app.tsx` (549 B) are non-empty leftovers |

### Non-empty components and modules with no non-test importer

| Path | Size | Note |
| --- | --- | --- |
| `src/components/AnimatedSection.tsx` | 2.3 KB | none |
| `src/components/FastCube.tsx` | 0.4 KB | none |
| `src/components/ModelCarousel.tsx`, `ModelViewer.tsx` | 7.3 / 2.9 KB | none |
| `src/components/RuwixWidget.tsx` | 6.3 KB | none; references `ruwix.com` and `ajax.googleapis.com` |
| `src/components/StatsSection.tsx` | 2.4 KB | none |
| `src/components/XWingViewer.tsx` | 5.2 KB | none |
| `src/components/widgets/SpotifyEmbed.tsx` | 2.6 KB | none |
| `src/components/StarshipBackground/DebugControls.tsx`, `DebugOverlay.tsx`, `configUtils.ts`, `modelUtils.ts` | 9.1 / 4.0 / 9.5 / 0.4 KB | none |
| `src/components/StarshipBackground/performanceUtils.ts`, `utils.ts` | 7.5 / 10.1 KB | tests only |
| `src/pages/LightsaberDemo.tsx` (and `components/LightsaberViewer/Viewer.tsx`, which only it imports) | 0.5 / 1.6 KB | not routed |
| `src/hooks/useLanguageHook.ts`, `src/contexts/LanguageContext.tsx` | 0.3 / 2.1 KB | `useLanguageHook` has no importer; `LanguageContext` is imported only by it. `App.tsx` mounts no `LanguageProvider` |
| `src/config/seoHtml.ts` | 2.7 KB | Imported by `vite.config.ts` (build-time) and a test; not dead |

`src/components/ui/` primitives with no importer found: `alert`, `aspect-ratio`, `avatar`, `breadcrumb`, `calendar`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `sidebar`, `slider`, `table`, `toggle-group`, `use-toast`.

### Unreferenced assets (no reference found in `src/`, `index.html`, `vercel.json`, `public/robots.txt`, `public/sitemap.xml`)

- `src/assets/`: `project-automation.jpg` 39.7 KB, `project-ecommerce.jpg` 42.0 KB, `project-taskmanager.jpg` 44.1 KB; `src/assets/3d-model/obiwan.gltf` 982.5 KB; `3d-model/4x1Legobrick/` (3 files, 128.7 KB); `3d-model/textures/2/official/color/` (5 PNGs, 305.1 KB); the unused LEGO images listed in section 6; the empty `skills/*.svg`.
- `public/`: `gold-coin-top.png` 410.1 KB, `obiwan_minifig.png` 263.3 KB, `vendor/obiwan kenobi.gltf` 698.6 KB, `placeholder.svg`, `resume-temp.txt`, and the duplicated `3d-model/Lego glb models/` GLBs (section 4c). `favicon.ico` has no `<link>` in `index.html` (browsers request it implicitly).
- Unused CSS classes in `src/index.css` and `components.css`: see sections 1, 5, and 6 (`.section-label-*`, `.floating-icon`, `.lego-square`, `.ambient-dot`, `.tp-flag`, and others).

---

## 9. How Hero and Projects read content

### Hero (`src/components/HeroSection.tsx`)

| Piece | Source | Evidence |
| --- | --- | --- |
| Greeting | Time-of-day text from `getCurrentGreeting()` plus `t(...)` greetings | `HeroSection.tsx:47-50`, `src/lib/time-utils.ts`, `src/config/translations.ts` |
| Name | Literal `Hugo Viegas` in JSX | `HeroSection.tsx` (`h1.heading-hero`) |
| Role and description | **Code**: `t("role")` and `t("description")` from `translations.ts:28-35` (EN and PT) | not Firestore |
| CTAs and labels | **Code**: `viewProjects`, `getInTouch`, `seeResume`, `downloadResume` (`translations.ts:36-39`) | not Firestore |
| Social links | **Code**: GitHub, LinkedIn, and a `mailto:` link hard-coded at `HeroSection.tsx:165`, `:177`, `:189` | not Firestore |
| CV link | **Firestore `settings/site.cv`** (`{ url, version }`), else the constant `FALLBACK_CV_URL` (a Vercel Blob URL, `:36-38`); `resumeUrl = cv?.url ?? FALLBACK_CV_URL` (`:64`), used for the download link (`:226`) and the PDF iframe (`:241-242`) | `useSiteFiles()` at `:44` |
| Profile photo | **Firestore `settings/site.profilePhoto`** `{ url, width, height, alt: { en, ptBR }, version }`, else the bundled `src/assets/hugo-hero.webp` (36.4 KB, imported at `:33`) | `LazyImage` at `:271-280`: `src={profilePhoto?.url ?? heroImage}`, `fallbackSrc={heroImage}`, `alt={profilePhoto?.alt[lang] ?? t("heroImageAlt")}`, `width/height` default 800 |

Photo and CV details:
- Types: `CvFile`, `ProfilePhoto`, `SiteFiles` (`src/content/types.ts:100-118`); a `null` field means "use the bundled fallback".
- Only Blob URLs on the configured store host are accepted: `isStoredBlobUrl("profile" | "cv", url)` (`src/content/uploadPolicy.ts:84-85`, host constant at `:6`); the runtime parser in `src/content/siteFiles.ts:18-56` turns anything malformed into `null` without Zod.
- Current committed snapshot (`src/content/snapshot/core.json`, `files`): a CV PDF and a profile photo at 1086×1086 with EN and PT-BR alt text, both `version: 1`.
- `LazyImage` (`src/components/LazyImage.tsx`) swaps to `fallbackSrc` once if `src` errors (`:62-69`); `priority` gives `loading="eager"`, `decoding="sync"`, `fetchpriority="high"` (`:86-89`).
- Hero images for the brick explosion are bundled webp, not content.

### Projects (`src/components/ProjectsSection.tsx`)

- Reads `useCoreContent().projects` and `useContentLang()` (`:23-24`) and maps each doc to a view model (`:43-55`).
- Data path: bundled snapshot `src/content/snapshot/core.json` (imported by `src/content/store.ts:6`, first paint) → after idle, `scheduleContentRefresh()` (`App.tsx:44`; `store.ts:40-62`, `requestIdleCallback` with a 5 s timeout, else a 2 s `setTimeout`; skipped in test mode) → `fetchSiteSettings()` reads `settings/site` over the Firestore REST API (`remoteCheck.ts:16-17`, `rest.ts`) → if `useRemote` is true and `updatedAt` is newer than the snapshot (`remoteCheck.ts:23-24`) → `refreshCore()` runs one `published == true` query per core collection (`refresh.ts:26-40`), validates each doc with Zod (`schema.ts`), drops invalid ones, and `mergeCore()` replaces the collection (an empty result keeps the snapshot docs) and the `files` block (`snapshotBuild.ts:19-33`) → `replaceCoreContent()` notifies subscribers via `useSyncExternalStore` (`store.ts:23-29`).
- Project docs are sorted by `order`, then `id` (`snapshotBuild.ts:10-13`). The committed snapshot holds two published projects: `big-bang-duel` (order 0) and `darcy-mcgees` (order 10).
- Project detail pages use `useProjectDetail(id)` (`src/content/useProjectDetail.ts`): snapshot `details.json` first, then a REST fetch of `projectDetails/<id>` when remote content is newer.
- Other sections reading the same store: `ExperienceSection` (experience, education, skills), `AboutSection` (`about[0]`), `SkillsSection` (skills).

**Project image-related fields** (`src/content/types.ts:40-50`, `src/content/schema.ts:74-92`):

| Field | Type / rule |
| --- | --- |
| `image` | `""`, a bundled-image key (`[a-z0-9-]+`, up to 100 chars), or an uploaded Blob URL accepted by `isStoredBlobUrl("project", …)` (`https://<store>/projects/<doc-id>/<name>.<webp\|avif\|jpg\|png>`) |
| `imageWidth`, `imageHeight` | integers 0-10000; `0` becomes `undefined` in the view (`ProjectsSection.tsx:49-50`) |
| `en.imageAlt`, `ptBR.imageAlt` | required strings, up to 200 chars |
| `detailPath` | `""` or a path matching `^/[a-z0-9/-]*$`; when set, the image and title link to it |
| `liveUrl`, `githubUrl` | `""` or an `https://` URL; the buttons render only when set |

Resolution: `resolveContentImage(image)` returns the value itself when it starts with `https://`, otherwise looks it up in `contentImages` (`src/content/images.ts:7-14`), which has two keys: `darcy-mcgees` → `src/assets/project-darcy-mcgees.webp` (153.0 KB) and `big-bang-duel` → `src/assets/project-big-bang-duel.webp` (53.2 KB). An unknown key yields no image and the image block is omitted (`ProjectsSection.tsx:77`). Both committed projects currently use the bundled keys (1280×720 and 864×557). The `<img>` carries `loading="lazy"`, `decoding="async"`, and `width`/`height` when known.
Upload limits (`uploadPolicy.ts:19-23`): project images up to 3 MB, profile photo up to 2 MB, CV up to 5 MB; WebP, AVIF, JPEG, or PNG for images.

**Project detail docs** (`projectDetails`: `stack`, `title`, `summary`, `sections[]`, `faq[]`, `storyTitle`, `storyIntro`, `story`, `src/content/types.ts:74-98`) have **no image fields**, and none of the three project pages renders an `<img>`.

---

## 10. Observed behaviour versus `CLAUDE.md`

Listed as facts for the design brief; no changes are proposed.

| `CLAUDE.md` statement | What the code does |
| --- | --- |
| Spaceship is optional, **disabled by default**, and activated from a control near theme/language | `BackgroundXWing` renders by default on `/` unless reduced motion is requested; no control exists (sections 4a, 1) |
| No 3D/WebGL on the primary homepage critical path | The WebGL chunk loads at `Index` render time; the X-wing GLB preloads on chunk load (section 4a) |
| No gradients | Gradient tokens and four in-use gradients exist (section 3) |
| One professional green accent, palette to come | Current primary is a cyan-teal (`174 100% 42%`), with a purple secondary and a neon-green `brand-accent` (section 3) |
| Target order: Hero, Projects, Experience, Skills, About, Contact, Footer | Rendered order is Hero, Experience, About (with Skills), Projects, Contact, Fun Stuff, Footer (section 7) |
| "Fun Stuff" hidden or collapsed by default | `WidgetsSection` renders all four cards expanded; the 3D viewers load on scroll proximity (section 7) |
| No new Star Wars UI in the primary flow | Existing Star Wars elements in the home flow: Obi-Wan nav icon, opening-crawl overlay in About, Falcon and lightsaber viewers (section 7) |
| ChatBot: no ping or pulse | The closed launcher has `animate-ping` (`ChatBot.tsx:272`) |
| Tailwind classes only, no inline styles | Inline `style` is used in `TopBricksRow`, `LegoButton`, `AmbientDots`, `WidgetsSection`, `ProjectsSection`, `HeroSection` (explosion variables) and others |
| Navigation target includes CV link and optional spaceship toggle | Neither is in `DynamicSidebar`; the CV is reached from a Hero button and dialog |
| Formula D out of main navigation and homepage footer | Not linked from `DynamicSidebar`; route `/formula-d` still exists and is `noindex` (`seo.ts:56-60`) |
| Hero: no typewriter | No typewriter usage found (the `typewriter` keyframe exists in `tailwind.config.ts` only) |

---

## 11. Open questions

1. Which background does the redesign treat as "the starship": the homepage `BackgroundXWing` (single X-wing, stars, planets) or the `StarshipBackground` demo system (multi-ship, GLB Falcon, debug tooling)? Only the first is rendered on the public site.
2. `BackgroundXWing` sets `showStars` from its container's computed `background-color` (`BackgroundXWing.tsx:81-128`, `:733`). The container has no background class (`:755-759`), so whether `showStars` ever turns false in light theme is unverified.
3. The unlayered `.sidebar-glass` at `index.css:1059-1065` uses `var(--color-glass-bg)` and `var(--color-glass-border)`, which hold HSL channel fragments (`design-tokens.css:63-64`) rather than full colours, while a layered `.sidebar-glass` (`index.css:82-85`) uses Tailwind alpha utilities. Which rule wins visually, and whether the unlayered declarations are valid at computed time, needs a browser check.
4. The language-toggle timers are never cleared (section 2). Is a rapid EN → PT click expected to be handled, and is the 150 ms `isToggling` guard meant to cover the 2.8 s flag sequence?
5. The flag images come from jsDelivr at runtime. Is a bundled flag asset expected for the preserved GB → IE effect, and should the GB flag stay in a site whose EN content is Irish-based? (`languages.ts` still lists a `🇺🇸` flag.)
6. `ThemeToggle` reads `theme`, not `resolvedTheme`. With `enableSystem` and a stored `system` value the icon shows the sun regardless of the OS theme. Is `system` ever stored?
7. `@tailwindcss/typography` is installed but not registered in `tailwind.config.ts`; `BigBangDuelStoryPage` uses `prose` classes. Do the story styles rely on that plugin?
8. Two token systems coexist (`--color-*` in `design-tokens.css`, shadcn-style `--background`… in `theme-tokens.css`) with two radius scales. Which is the source of truth for the new design system?
9. The section-spy label described in the brief does not exist in the TSX; only the active highlight does. Was a text label intended, or is it the leftover CSS (`.section-label-*`) from an earlier version?
10. Hero and Projects images: the profile photo and CV now come from `settings/site`, while project cards still use bundled keys. Should the design system assume a fixed square photo (the committed photo is 1086×1086 and the frame is `aspect-square`) and 16:9 / 864×557 / 1280×720 mixed project images (the card image box is `h-44 md:h-56` with `object-cover`)?
11. `public/` and `src/assets/` hold about 25 MB and 19 MB, including duplicated GLBs and unreferenced models and images (section 8). Are any of these intentionally retained?
12. `.env.sample` is unmerged (`UU`) in the working tree and the merge of `origin/main` is incomplete. The audit reflects the merged tree as of 23:00 UTC; if the merge result changes, section 9 should be re-checked.
13. `dist/` is a stale September build. Bundle sizes were not measured in this audit (no build was run).

---

## Scope coverage

| Scope item | Section | Not found |
| --- | --- | --- |
| Top bar and navigation, scroll label, mobile, `TopControls` / `ThemeToggle` / `DynamicSidebar` | 1 | Scroll-driven text label (only an active highlight exists); CV link and spaceship toggle in the bar |
| Language toggle, flag animation, `isToggling`, flag assets, effect to preserve | 2 | Local (bundled) flag assets |
| Theme handling and design tokens | 3 | Pre-hydration theme script |
| Starship background (components, hooks, utils, WebGL setup, assets, lazy loading, fallbacks, toggle) | 4 | User toggle; error boundary and WebGL check on the homepage background; mobile/FPS logic in `BackgroundXWing` |
| Star field and planets | 5 | Textures or images for planets (all procedural) |
| LEGO blocks and buttons | 6 | Any code-drawn (SVG/canvas/CSS-shape) bricks |
| Components on home and project pages, heavy effects | 7 | none |
| Dead and empty files, unimported components | 8 | none |
| Hero and Projects content reads, project image fields, profile photo | 9 | Image fields on project detail docs; Hero copy in Firestore |
