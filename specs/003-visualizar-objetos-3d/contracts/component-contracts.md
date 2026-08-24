# Component Contracts: Portfolio Refresh

## HeroSection

### Purpose

Present concise intro text, hero image, background animations, and action buttons including the cube modal trigger.

### Interface

```typescript
interface HeroSectionProps {
  profileImageSrc: string;
  headline: string; // ≤ 35 characters
  subheadline: string; // ≤ 70 characters
  actions: HeroActionModel[]; // From data model
  onAction: (actionId: HeroActionModel["id"]) => void;
  backgroundSettings: HeroBackgroundSettings;
}

interface HeroBackgroundSettings {
  showLightsaber: boolean;
  legoParticleDensity: "low" | "medium" | "high";
}
```

### Behaviour

- Render actions in a single row on desktop, stacked on mobile.
- Trigger `onAction` before executing local behaviour (e.g., open modal, mailto).
- Ensure cube action includes visually-hidden text "Open Rubik's cube viewer" for screen readers.
- Remove ground glow and ensure floating lightsaber respects theme brightness.
- Pause lightsaber animation while cube modal open (prop from parent).

## CubeModal

### Purpose

Display interactive Rubik's cube using existing `FastCube` component inside accessible modal.

### Interface

```typescript
interface CubeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewerConfig: CubeViewerPreset;
  onInteraction: () => void; // Called when user drags/zooms
}
```

### Behaviour

- Implement via Radix `Dialog.Root` with `open`/`onOpenChange`.
- Overlay uses semi-transparent dark background (`bg-slate-950/70`).
- Focus trap ensures first focus on close button; trap released on close.
- Accept ESC, close button, overlay click.
- When `onInteraction` triggered, update shared rotation timestamp.
- Expose `aria-label` describing viewer: "Interactive Rubik's cube".

## NavigationBar

### Purpose

Provide quick links to sections following new order.

### Interface

```typescript
interface NavigationBarProps {
  links: NavbarLink[];
  activeId: PortfolioSection["id"];
  onNavigate: (id: PortfolioSection["id"]) => void;
}
```

### Behaviour

- Desktop: inline list with underline indicator; mobile: collapsible menu/hamburger.
- On click, call `onNavigate` then smooth-scroll using section anchor.
- Manage reduced motion preference (fallback to instant scroll if `prefers-reduced-motion: reduce`).
- Provide `aria-current="true"` on active link.

## SkillsSection

### Purpose

Show categories of skills as compact icon grid without percentages.

### Interface

```typescript
interface SkillsSectionProps {
  categories: SkillCategory[];
  tiles: SkillTile[];
  layout?: { baseColumns: number; lgColumns: number };
}
```

### Behaviour

- Render each category with label and optional description.
- Use CSS grid with responsive columns (default 2 base / 3 large).
- Each `SkillTile` displayed as 64px card with icon centered and label beneath or as tooltip.
- Provide fallback background for darker icons to ensure contrast.
- Support keyboard navigation; each tile `button` with `aria-label` = skill name.

## ExperienceSection

### Purpose

Display Work, Education, and Certificates in tabbed layout.

### Interface

```typescript
interface ExperienceSectionProps {
  groups: ExperienceGroupBlock[]; // Expect 3 groups
}

interface ExperienceTabProps {
  group: ExperienceGroupBlock;
  isActive: boolean;
  onSelect: () => void;
}

interface ExperienceCardProps {
  entry: ExperienceEntry;
}
```

### Behaviour

- Tabs accessible (ARIA role="tablist" etc.).
- Active tab content fades in (<200ms) without vertical jump.
- Cards show title, organization, timeframe, 1-3 bullet highlights, optional tags.
- Provide print-friendly styles (cards collapse to simple list).

## ProjectsSection

### Purpose

Retain existing project cards but ensure copy trimmed and order consistent with new layout.

### Adjustments

- Accept optional `intro` prop for short statement (≤ 20 words).
- Ensure CTA buttons align with new design (Lego-styled primary buttons).

## AboutSection

### Purpose

Replace long prose with short highlight block(s).

### Interface

```typescript
interface AboutSectionProps {
  highlights: TextHighlightBlock[];
}
```

### Behaviour

- Render each highlight as card with optional icon and supporting text.
- Provide variant for "stats row" to show numbers (if kept) without percentages.

## ContactSection

### Purpose

Offer clear methods to reach the author with simplified copy.

### Interface

```typescript
interface ContactSectionProps {
  channels: ContactChannel[];
  availabilityNote?: string;
}
```

### Behaviour

- Render cards or list items each containing icon, label, secondary text.
- `a` elements with `rel="noopener"` for external links.
- Provide `data-track="contact"` attribute for future analytics.
- Include optional inline form toggle for future expansions (not required now).

## BricksViewerPage

### Purpose

Uphold spec requirements for `/bricks` route while aligning visuals with refreshed design.

### Interface

```typescript
interface BricksViewerPageProps {
  config: BricksViewerConfig;
  onError: (error: ViewerError) => void;
}
```

### Behaviour

- Render navbar consistent with home page.
- Use `Canvas` from `@react-three/fiber` with controlled orbit controls (drag + scroll, no pan).
- Auto-rotate at `config.autoRotateSpeed`; pause on user interaction using shared helper.
- On error, render `ViewerFallback` with message and optional retry for dev.

## AnimatedSection Wrapper

- Continue using existing `AnimatedSection` to handle fade/slide-in.
- Ensure threshold tuned so shorter sections still trigger (consider 0.35 viewport intersection).

## Testing Expectations

- Unit tests for `HeroSection` verifying `onAction` fired and accessible labels present.
- Accessibility tests for `CubeModal` ensuring focus trap & ESC close using RTL + `@testing-library/user-event`.
- Snapshot/regression tests for `SkillsSection` grid ordering.
- Interaction test verifying navigation order updates `aria-current` correctly.

These contracts align components with the simplified layout while preserving the original 3D viewer functionality mandated by the feature specification.
