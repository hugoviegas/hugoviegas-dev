# Data Model: Portfolio Layout Simplification & Cube Modal

## Core Entities

### PortfolioSection

Represents each top-level section rendered on the landing page in the requested order.

```typescript
interface PortfolioSection {
  id: "me" | "experience" | "projects" | "about" | "contact" | "bricks";
  title: string; // Display heading (≤ 3 words)
  summary?: string; // Optional short paragraph (≤ 18 words)
  anchor: string; // DOM id used for navbar links
  order: number; // Numerical order for navigation + scroll spy
  cta?: SectionCTA; // Optional button/link for section-specific action
  blocks: ContentBlock[]; // Rich content items rendered inside section
}
```

### SectionCTA

```typescript
interface SectionCTA {
  label: string; // Short verb-first label (e.g., "Chat")
  href?: string; // External or internal link
  action?: "open-modal" | "download" | "navigate";
  icon?: string; // Lucide icon name or asset path
  target?: "_blank" | "_self";
}
```

### ContentBlock

Flexible structure for cards, lists, and grid items.

```typescript
type ContentBlock =
  | SkillCategoryBlock
  | ExperienceGroupBlock
  | JourneyTimelineBlock
  | ContactChannelBlock
  | TextHighlightBlock;
```

### SkillCategoryBlock

```typescript
interface SkillCategoryBlock {
  kind: "skills";
  category: SkillCategory;
  items: SkillTile[]; // Individual technologies/tools
  layout: "grid"; // Grid enforced for new design
}
```

### SkillCategory

```typescript
interface SkillCategory {
  id: string; // e.g., "frontend"
  label: string; // e.g., "Frontend"
  iconPath: string; // Absolute path under src/assets/skills/
  description?: string; // Optional one-liner (≤ 10 words)
}
```

### SkillTile

```typescript
interface SkillTile {
  id: string; // slug ("html")
  name: string; // Display name
  assetPath: string; // Official icon or fallback SVG path
  categoryId: string; // Reference to SkillCategory.id
  level?: "daily" | "comfortable" | "exploring"; // Optional tag badges
}
```

### ExperienceGroupBlock

```typescript
interface ExperienceGroupBlock {
  kind: "experience";
  group: "work" | "education" | "certificates";
  entries: ExperienceEntry[];
}
```

### ExperienceEntry

```typescript
interface ExperienceEntry {
  id: string;
  title: string; // Role or achievement
  organization: string;
  location?: string;
  timeframe: Timeframe;
  highlights: string[]; // Bullet list (max 3 items)
  tags?: string[]; // Tech or themes (max 4 chips)
}
```

### Timeframe

```typescript
interface Timeframe {
  start: string; // ISO date or "2022"
  end?: string; // Same format; undefined = present
}
```

### JourneyTimelineBlock

Used for "My Journey" sequence.

```typescript
interface JourneyTimelineBlock {
  kind: "journey";
  milestones: JourneyMilestone[];
}

interface JourneyMilestone {
  id: string;
  title: string;
  description: string; // ≤ 16 words
  year: string; // Display year or range
}
```

### ContactChannelBlock

```typescript
interface ContactChannelBlock {
  kind: "contact";
  channels: ContactChannel[];
  availabilityNote?: string; // Single sentence about response time
}

interface ContactChannel {
  id: "email" | "linkedin" | "github" | "calendly" | string;
  label: string;
  href: string;
  iconPath: string; // Icon asset path (SVG/PNG)
  secondaryText?: string; // e.g., username or timezone
}
```

### TextHighlightBlock

```typescript
interface TextHighlightBlock {
  kind: "text";
  heading?: string;
  body: string; // Supports inline emphasis; ≤ 240 characters
  iconPath?: string;
}
```

### HeroActionModel

Defines hero buttons including the cube modal trigger.

```typescript
interface HeroActionModel {
  id: "email" | "resume" | "cube";
  label: string;
  iconPath: string; // e.g., lego brick SVG for cube
  intent: "mailto" | "download" | "open-modal";
  href?: string; // For mailto/download
}
```

### CubeModalState

```typescript
interface CubeModalState {
  isOpen: boolean;
  lastInteracted: number; // timestamp used to resume rotations
  viewerPreset: CubeViewerPreset;
}

interface CubeViewerPreset {
  autoRotate: boolean;
  rotationSpeed: number; // radians per second
  allowInteraction: boolean; // manual drag toggle
}
```

### BricksViewerConfig

Extends original spec for `/bricks` page.

```typescript
interface BricksViewerConfig {
  modelPath: string; // Path to OBJ within src/assets/3d-model
  fallbackGraphic: string; // SVG path shown on load failure
  autoRotateSpeed: number; // Default rpm for idle rotation
  interactionTimeoutMs: number; // Idle timeout (default 10000 per spec)
  camera: {
    position: [number, number, number];
    fov: number;
  };
  controls: {
    enableZoom: boolean;
    enablePan: false;
  };
}
```

## Relationships

- `PortfolioSection.blocks` references the different block types; UI components resolve on `kind`.
- `SkillTile.categoryId` must map to an existing `SkillCategory.id`.
- `ExperienceGroupBlock.entries` share `group` to feed tabbed/toggle UI.
- `HeroActionModel` with `intent === "open-modal"` toggles `CubeModalState.isOpen` and pauses hero background animation while modal active.
- `/bricks` route reuses `BricksViewerConfig` and shares interaction timeout with cube modal so behaviour stays consistent.

## Validation Rules

- Section order must follow numeric sequence without gaps (1..n) to keep nav consistent.
- Skill categories require unique `iconPath`; missing official assets fallback to pre-approved SVG stored locally.
- Experience highlights limited to three bullet items, each ≤ 120 characters to maintain compact layout.
- Contact channels must include `href` with valid scheme (`mailto:`, `https://`).
- Cube modal must enforce `rotationSpeed` between 0.2 and 1.5 radians/sec to avoid motion sickness.
- Bricks viewer must reference OBJ/MTL pairs stored under `src/assets/3d-model` and provide placeholder fallback.

## State & UI Considerations

- Navigation state tracks active `PortfolioSection.id` based on scroll. Debounce updates to avoid jitter when sections are shorter.
- Hero background animation layer listens to `CubeModalState.isOpen`; when `true`, pause rotation and resume after `lastInteracted + 10000`ms.
- Skills grid uses CSS grid with responsive columns (min 3 columns desktop, 2 on mobile) and ensures icons fit within 64px square tokens.
- Experience tabs default to Work; user selection persisted in local component state but not stored globally.
- Contact block uses `aria-label` built from `label` + `secondaryText` for screen readers.

## Derived Data Helpers

- `getOrderedSections(sections: PortfolioSection[]): PortfolioSection[]` sorts by `order` and filters disabled ones.
- `groupExperience(entries: ExperienceEntry[]): Record<Group, ExperienceEntry[]>` for tab layout.
- `getSkillAssets(categoryId)` resolves absolute icon paths for bundler imports.
- `shouldResumeRotation(lastInteracted: number, now: number)` returns boolean used in hero and bricks viewers.

## Testing Hooks

- Snapshot test of `PortfolioSection` ordering to ensure nav updates when data changes.
- Accessibility test verifying `CubeModalState` toggles focus trap and ESC close via simulation.
- Unit test for `shouldResumeRotation` to match 10s timeout requirement from spec.
