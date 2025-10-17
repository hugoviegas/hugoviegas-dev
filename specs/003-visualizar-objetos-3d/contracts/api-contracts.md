# Interaction Contracts: Navigation, Modals & Viewer Behaviour

> No remote APIs are introduced. These contracts document UI events, component interactions, and shared utilities required for the refreshed portfolio and `/bricks` viewer.

## Event Bus Overview

All events are dispatched via lightweight React context (`NavigationEventBus`) to keep sections decoupled.

```typescript
type NavigationEvent =
  | {
      type: "nav:jump";
      target: PortfolioSection["id"];
      source: "navbar" | "hero-cta";
    }
  | { type: "modal:cube:open"; trigger: "hero" }
  | { type: "modal:cube:close"; reason: "esc" | "cta" | "backdrop" }
  | { type: "viewer:interaction"; viewer: "cube" | "bricks"; timestamp: number }
  | { type: "viewer:auto-rotate:resume"; viewer: "cube" | "bricks" };

interface NavigationEventBus {
  dispatch(event: NavigationEvent): void;
  subscribe(handler: (event: NavigationEvent) => void): () => void;
}
```

## Modal Lifecycle Contract

### Open Sequence

1. `nav:jump` (if hero button triggers scroll) → ensure hero section is focused.
2. Dispatch `modal:cube:open`.
3. Modal component:
   - Sets `CubeModalState.isOpen = true`.
   - Locks body scroll (`overflow-hidden` on `<body>`).
   - Focuses close button (`refClose.current.focus()`).
   - Dispatches `viewer:interaction` for cube with current timestamp.

### Close Sequence

- Accepts ESC key, close button click, or backdrop click.
- Dispatch `modal:cube:close` with reason.
- Restores focus to trigger button and removes body scroll lock.
- Schedules `viewer:auto-rotate:resume` after 10s (shared helper ensures consistent behaviour with `/bricks`).

## Navigation Contract

```typescript
interface NavbarLink {
  id: PortfolioSection["id"];
  label: string; // ≤ 10 characters
  href: `#${PortfolioSection["anchor"]}`;
}

interface ScrollSpyConfig {
  sections: PortfolioSection[];
  onActiveChange: (id: PortfolioSection["id"]) => void;
  offsetPx: number; // Accounts for navbar height
}
```

- Navbar dispatches `nav:jump` before calling `scrollIntoView({ behavior: "smooth" })`.
- Scroll spy listens to intersection observer updates and updates active link state (debounced 150ms).
- Hero CTA "See Projects" should reuse `nav:jump` with target `"projects"`.

## Skills Grid Contract

```typescript
interface SkillsGridProps {
  categories: SkillCategory[];
  tiles: SkillTile[]; // Already grouped by categoryId
  columns: { base: 2; lg: 3; xl: 4 };
  onTileFocus?: (tile: SkillTile) => void; // For tooltip or analytics
}

interface SkillTileProps {
  tile: SkillTile;
  iconSize?: number; // default 64
  showLabel: boolean; // always true on desktop; optional on mobile
}
```

- Icons must include `alt` text describing the technology.
- Fallback icons flagged with `data-fallback="true"` for later refinement.
- Grid uses CSS `gap-4` desktop, `gap-3` mobile.

## Experience Tabs Contract

```typescript
interface ExperienceTabsProps {
  groups: ExperienceGroupBlock[]; // Each group corresponds to tab
  defaultGroup: "work";
  onGroupChange?: (group: ExperienceGroupBlock["group"]) => void;
}

interface ExperienceCardProps {
  entry: ExperienceEntry;
}
```

- Tabs use Radix `Tabs` or headless implementation ensuring keyboard navigation (Arrow keys, Home/End).
- `ExperienceCard` renders title, organization, timeframe, highlights list.
- When group changes, container height animates but should clamp to `min-h-[220px]` to avoid jump.

## Contact Section Contract

```typescript
interface ContactSectionProps {
  channels: ContactChannel[];
  availabilityNote?: string;
}

interface ContactCardProps {
  channel: ContactChannel;
}
```

- Each card is a `button` or `a` element with `role="link"`, `tabIndex=0`.
- Primary action triggers `window.open(channel.href)` or `mailto:`.
- Secondary text displayed under label using subdued color.

## Viewer Synchronisation Helpers

```typescript
interface ViewerRotationController {
  markInteraction(viewer: "cube" | "bricks"): void;
  shouldResume(viewer: "cube" | "bricks", now: number): boolean;
}

const INTERACTION_TIMEOUT_MS = 10_000; // from feature spec clarifications
```

- `markInteraction` invoked when user drags or zooms.
- `shouldResume` used inside animation loop; returns true when idle duration ≥ timeout.
- Shared between hero modal viewer and `/bricks` page to keep behaviour consistent.

## Error & Fallback Contract

```typescript
type ViewerError =
  | { type: "model-load"; message: string; suggestion?: string }
  | { type: "asset-missing"; assetPath: string }
  | { type: "webgl"; message: string };

interface ViewerFallbackProps {
  error: ViewerError;
  onRetry?: () => void;
}
```

- When OBJ fails to load, display placeholder from `public/placeholder.svg` and copy "Couldn't load the brick right now." with optional retry button in dev mode.
- Log detailed error to console for debugging but avoid exposing raw stack to users.

## Analytics & Telemetry (Optional Future Work)

- Provide hook `useHeroInteractions` capturing CTA clicks and modal open count. Data stored locally (no external service) unless integration requested later.

These contracts ensure interactive pieces remain predictable and accessible while honouring the 3D viewer requirements defined in the feature specification.
