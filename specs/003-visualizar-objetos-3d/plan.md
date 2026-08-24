# Implementation Plan: Visualizar objetos 3D + Portfolio Simplification

**Branch**: `003-visualizar-objetos-3d` | **Date**: 2025-10-06 | **Spec**: `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\specs\003-visualizar-objetos-3d\spec.md`
**Input**: Feature specification from `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\specs\003-visualizar-objetos-3d\spec.md` and user brief about compacting portfolio content

## Execution Flow (/plan command scope)

```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:

- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

We will evolve the bricks viewer feature into a cohesive portfolio refresh. The `/bricks` experience must still deliver the Obi-Wan 3D model with automatic rotation and manual controls, while the landing page is refactored to present concise copy, reorganised sections (Me → Experience → Projects → About → Contact), a skill grid grouped by category icons, and a hero action that launches the Rubik's cube viewer inside a modal triggered by a Lego-inspired button. Experience items need separate tabs for Work, Education, and Certificates, contact details must match the simplified tone, and the hero background should show a floating lightsaber plus Lego bricks without the current glow under the profile photo.

## Technical Context

**Language/Version**: TypeScript 5.8.3, JSX/TSX with React 18.3.1  
**Primary Dependencies**: Vite 5 toolchain, React Router DOM 6.30.1, Tailwind CSS 3.4.17, Radix UI primitives, @react-three/fiber + Three.js for the 3D viewer, Lucide React icons  
**Storage**: None (static assets under `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\assets`)  
**Testing**: Jest + React Testing Library per `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\jest.config.js`  
**Target Platform**: Responsive web (desktop & mobile) served via Vercel  
**Project Type**: Web frontend (single Vite React SPA)  
**Performance Goals**: Maintain 60fps animations for hero background and 3D viewer, keep initial bundle within current budget (≤ 250 KB gzipped) while trimming textual content  
**Constraints**: Ensure accessible modals (focus trap, ESC close) for cube popup, preserve dark/light theming, avoid layout shifts when replacing hero subcomponents  
**Scale/Scope**: Single personal portfolio with five top-level sections and one dedicated `/bricks` showcase page

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- Constitution document currently provides no explicit principles; treat as neutral baseline. No conflicting mandates detected.
- Proceed under assumption of standard simplicity and accessibility expectations for portfolio features.
- Result: **PASS** (nothing to remediate at this stage).

**Post-Design Review**

- Phase 1 outputs (research, data model, contracts, quickstart) align with accessibility and simplicity goals.
- No additional governance conflicts introduced. **PASS**.

## Project Structure

### Documentation (this feature)

```
C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\specs\003-visualizar-objetos-3d\
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts\           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
src/
├── App.tsx
├── main.tsx
├── assets/
│   ├── 3d-model/
│   ├── lego-bricks/
│   └── project-*.jpg
├── components/
│   ├── HeroSection.tsx
│   ├── Navbar.tsx
│   ├── LightsaberViewer/
│   ├── BlueBrickViewer/
│   ├── widgets/
│   └── ui/
├── features/
│   └── proposta/
├── hooks/
├── contexts/
└── styles/

public/
├── 3d-model/
├── games/
└── vendor/

tests/
└── (Jest tests colocated under src/lib/__tests__)
```

**Structure Decision**: Single Vite React frontend; all changes live under `src` with emphasis on `components`, `features/proposta`, and `assets`. `/public` hosts heavier 3D assets consumed by the viewer.

## Phase 0: Outline & Research

1. **Unknowns & research prompts**

   - Tone calibration for concise, personable copy across hero, section headers, and contact call-to-action.
   - Accessible modal patterns for React + Tailwind when launching the Rubik's cube (focus trap, keyboard controls, scroll locking).
   - Asset sourcing guidelines for official language/framework logos without licensing conflicts.
   - Performance impact of background animations (floating lightsaber + Lego particles) alongside 3D viewer; identify optimisation tactics (e.g., memoised Three.js scenes, requestAnimationFrame throttling).

2. **Dispatch research tasks** (documented in `research.md`):

   - "Research approachable microcopy examples for developer portfolios that avoid AI tone."
   - "Review WAI-ARIA modal dialog requirements suitable for Radix/Dialog or headless Tailwind implementation."
   - "Compile official SVG sources for HTML, CSS, JS, TS, React, Node, Tailwind, etc., including fallback icons for less common tools."
   - "Investigate lightweight animation strategies for simultaneous floating lightsaber and Lego background without blocking the main thread."

3. **Consolidate findings** → `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\specs\003-visualizar-objetos-3d\research.md` with Decision/Rationale/Alternatives for each topic. Confirm no outstanding clarifications remain before entering Phase 1.

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Information architecture** → `data-model.md`:

   - Define `PortfolioSection` ordering, `SkillCategory` with assets, `ExperienceEntry` variants (work, education, certificates), and modal state models for hero cube.
   - Capture validation such as mandatory icon assets and copy length caps.

2. **Interaction contracts** → `/contracts/`:

   - Document UI contracts instead of network endpoints: navigation events, modal open/close behaviour, accessibility expectations.
   - Provide component interface outline (props, expected assets) for hero modal trigger and skills grid tiles.

3. **Test planning**:

   - Identify unit/integration tests verifying navigation order, modal accessibility, and 3D viewer controls interplay.
   - Ensure at least one Jest test stub fails initially (e.g., snapshot or accessibility expectation) once implemented.

4. **Quickstart** → `quickstart.md` summarises how to preview the redesigned layout, toggle sections, and validate the cube modal.

5. **Agent context update**: After drafting Phase 1 outputs, run `pwsh -File ./.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot` from repo root so `.github/copilot-instructions.md` stays current with new UI patterns and assets.

**Output**: `data-model.md`, `/contracts/` docs, placeholder failing test plan (to be codified during implementation), `quickstart.md`, refreshed agent instructions.

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P]
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:

- TDD order: Tests before implementation
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 20-25 numbered, ordered tasks in tasks.md (UI-focused scope with limited backend work)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

_These phases are beyond the scope of the /plan command_

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |

## Progress Tracking

_This checklist is updated during execution flow_

**Phase Status**:

- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [ ] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [ ] Complexity deviations documented

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
