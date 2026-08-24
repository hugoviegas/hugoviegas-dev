# Research: Portfolio Simplification & 3D Viewer Integration

## Overview

Findings supporting the redesigned portfolio layout, concise copywriting, updated skills presentation, modal-based cube interaction, and floating lightsaber background while preserving the `/bricks` 3D viewer requirements from the feature spec.

## Topic: Conversational, Concise Portfolio Copy

**Decision**: Write microcopy using "confident first-person" tone (short sentences, active verbs, light humor) with max 18 words per paragraph and 3 bullet limit per section.  
**Rationale**:

- Aligns with request for clear, short, non-AI-feeling text.
- Supports quick visual scanning across the reordered sections.
- Matches reference inspiration without duplicating layout.
  **Alternatives considered**:
- Formal resume-style phrasing → rejected; feels corporate and verbose.
- Overly casual slang → risks professionalism and international comprehension.

## Topic: Accessible Modal for Rubik's Cube Viewer

**Decision**: Use Radix UI `Dialog` (already in stack) with controlled open state, focus trap, ESC/overlay close, and `aria-labelledby`/`aria-describedby` tied to hero copy.  
**Rationale**:

- Radix provides accessible primitives out-of-the-box, reducing custom focus management.
- Works seamlessly with Tailwind for styling and can host existing cube component using React portals.
- Minimal bundle impact since Radix already shipped.  
  **Alternatives considered**:
- Build custom headless modal → more code, higher risk of accessibility regressions.
- Use third-party modal (e.g., React Modal) → extra dependency, inconsistent styling.

## Topic: Official Skill Icon Sourcing

**Decision**: Pull SVG/PNG logos from vendor-neutral sources (Simple Icons CDN for common tech, official brand media kits for HTML/CSS/JS). Cache copies under `src/assets/skills/` with attribution tracked in README.  
**Rationale**:

- Ensures consistent sizing and licensing clarity.
- Allows build-time optimization (SVGO) and offline availability.
- Supports theming by applying Tailwind `fill-current` or background tokens as needed.  
  **Alternatives considered**:
- Hotlinking CDN icons → fragile and risks layout flicker offline.
- Manually redrawing icons → unnecessary work, potential trademark issues.

## Topic: Hero Background Performance (Lightsaber + Lego Particles)

**Decision**: Keep lightsaber mesh inside `@react-three/fiber` scene with baked rotation animation while moving lego particles handled via CSS `@keyframes`/`transform` to offload from Three.js; throttle scene updates using `useFrame` with delta clamp (≤ 60fps) and pause when hero cube modal open.  
**Rationale**:

- Splits workload between GPU-accelerated CSS and Three.js, preventing main-thread blocking.
- Reuses existing lightsaber component while disabling ground glow.
- Allows automatic resume of rotation after inactivity aligning with 3D viewer spec (10s).  
  **Alternatives considered**:
- Fully Three.js particle system → heavier CPU cost for minimal benefit.
- Pure CSS for saber → loses depth/lighting realism desired in background.

## Topic: Section Navigation & Scroll Order

**Decision**: Implement single-page layout with `section` IDs mapped to navbar anchors in new order (me, experience, projects, about, contact) and update scrollspy logic to match.  
**Rationale**:

- Maintains router simplicity (no extra routes) while delivering requested order.
- Works with existing `AnimatedSection` intersection observer wrapper.
- Allows quick cross-link updates from hero CTA buttons.  
  **Alternatives considered**:
- Split into multi-page navigation → adds loading overhead, breaks flow.
- Keep old order but update nav text → contradicts requirement.

## Outstanding Questions

None. Requirements are actionable following these decisions.

## Next Steps

1. Translate decisions into data structures (`data-model.md`).
2. Define UI interaction contracts (modal, navigation, skills grid) in `/contracts/`.
3. Draft quickstart instructions for validating layout locally and smoke-checking viewer modal.
