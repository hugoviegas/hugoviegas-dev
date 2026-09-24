# Tasks: Star Wars Starship Background

**Input**: Design documents from `/specs/003-visualizar-objetos-3d/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory ✓
   → Extract: TypeScript 5.8.3, React 18.3.1, React Three Fiber, Three.js
2. Load optional design documents ✓
   → data-model.md: StarshipConfig, AnimationState, StarshipInstance entities
   → contracts/: Component and API contract specifications
   → research.md: React Three Fiber decisions, animation patterns
3. Generate tasks by category ✓
   → Setup: React Three Fiber dependencies, TypeScript types
   → Tests: Component tests, integration tests, performance tests
   → Core: Components, hooks, configurations
   # Tasks: Visualizar objetos 3D + Portfolio Simplification

   **Input**: Design documents from `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\specs\003-visualizar-objetos-3d`
   **Prerequisites**: `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

   ## Phase 3.1: Setup
   - [ ] T001 Audit existing assets and create `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\assets\skills\` with official/fallback SVG icons listed in research (include `README.md` documenting sources).
   - [ ] T002 Establish copy source files in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\features\proposta\content\microcopy.ts` with short-form strings following research tone guidelines.

   ## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
   **All tests must be committed failing before implementation begins.**
   - [ ] T003 Write contract test for `NavigationEventBus` interactions in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\features\proposta\__tests__\NavigationEventBus.contract.test.tsx`.
   - [ ] T004 [P] Write contract test for `ViewerRotationController` idle-resume behaviour in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\lib\__tests__\viewerRotationController.contract.test.ts`.
   - [ ] T005 [P] Add component contract tests for `HeroSection` actions and accessible labels in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\__tests__\HeroSection.contract.test.tsx`.
   - [ ] T006 [P] Add component contract tests for `CubeModal` focus trap and ESC handling in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\__tests__\CubeModal.contract.test.tsx`.
   - [ ] T007 [P] Add snapshot/regression tests for skills grid layout in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\__tests__\SkillsSection.contract.test.tsx`.
   - [ ] T008 [P] Add accessibility & tab-change tests for `ExperienceSection` in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\__tests__\ExperienceSection.contract.test.tsx`.
   - [ ] T009 [P] Add contract tests for `ContactSection` link semantics in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\__tests__\ContactSection.contract.test.tsx`.
   - [ ] T010 [P] Create integration test covering section order + navbar scrollspy in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\features\proposta\__tests__\PortfolioLayout.integration.test.tsx`.
   - [ ] T011 [P] Create integration test for `/bricks` viewer idle-resume + fallback in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\LightsaberViewer\__tests__\BricksViewer.integration.test.tsx`.

   ## Phase 3.3: Core Implementation (ONLY after tests are failing)
   - [ ] T012 Implement portfolio type definitions (entities/helpers from data-model) in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\features\proposta\types\portfolio.ts`.
   - [ ] T013 Populate structured data (`PortfolioSection`, skills, experience, journey, contact) in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\features\proposta\content\sections.ts`.
   - [ ] T014 Create shared `ViewerRotationController` helper per contract in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\lib\viewer-rotation.ts`.
   - [ ] T015 Build `NavigationEventBus` React context + provider in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\features\proposta\contexts\NavigationEventBus.tsx`.
   - [ ] T016 Refactor `HeroSection` to new concise layout, lego cube button, and background controls in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\HeroSection.tsx`.
   - [ ] T017 Implement dedicated `CubeModal` component using Radix Dialog in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\CubeModal.tsx`.
   - [ ] T018 Update `Navbar` to consume ordered sections + dispatch events in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\Navbar.tsx`.
   - [ ] T019 Rebuild `SkillsSection` with icon grid + categories in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\SkillsSection.tsx`.
   - [ ] T020 Refactor `ExperienceSection` into Radix tabs for Work/Education/Certificates in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\ExperienceSection.tsx`.
   - [ ] T021 Trim copy and align CTAs in `ProjectsSection` at `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\ProjectsSection.tsx`.
   - [ ] T022 Replace About prose with highlight blocks in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\AboutSection.tsx`.
   - [ ] T023 Rework `ContactSection` cards per contract in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\ContactSection.tsx`.
   - [ ] T024 Update `PropostaPresentation` composition/order and wire hero cube modal + event bus in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\features\proposta\PropostaPresentation.tsx`.
   - [ ] T025 Adjust lightsaber background + lego particles in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\HeroLightsaber.tsx` and related CSS to remove floor glow and pause on modal.
   - [ ] T026 Align `/bricks` viewer with shared rotation helper and fallback messaging in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\components\LightsaberViewer\LightsaberViewer.tsx` (plus related control hooks).

   ## Phase 3.4: Integration
   - [ ] T027 Wire `NavigationEventBusProvider` into `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\App.tsx` and ensure scrollspy uses new data.
   - [ ] T028 Synchronise hero modal + `/bricks` page idle timers via shared store in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\features\proposta\hooks\useRotationControl.ts`.
   - [ ] T029 Update translations/config references in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\config\translations.ts` and `languages.ts` to match new copy keys.

   ## Phase 3.5: Polish
   - [ ] T030 [P] Optimise new skill SVG assets with SVGO and document usage in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\src\assets\skills\README.md`.
   - [ ] T031 [P] Update `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\README.md` and `quickstart.md` notes with new layout instructions and modal toggle guidance.
   - [ ] T032 [P] Run `npm run lint` and `npm test` ensuring all suites (including new contracts/integration) pass; capture notes in `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path\TODO.md` if follow-ups needed.

   ## Dependencies
   - T001 → prerequisite for components needing local icons (blocks T019, T030).
   - T002 → prerequisite for copy-driven components (blocks T016, T021, T022, T023).
   - Tests T003–T011 must be completed (and failing) before starting T012 onwards.
   - T012 provides types for data files (blocks T013, T015, T024).
   - T013 feeds section-driven components (blocks T018–T024).
   - T014 must finish before T011 can pass and before T026 & T028.
   - T015 must precede T018 and T024.
   - T016–T023 feed integration wiring (T024–T028).
   - T029 depends on T021–T024 for final copy keys.
   - Polish tasks T030–T032 run only after all prior implementation/integration tasks succeed.

   ## Parallel Execution Example
```

# After T003 completes, launch parallel contract tests

Task.run --tasks "T004,T005,T006,T007,T008,T009,T010,T011"

# During polish, optimise assets and docs together

Task.run --tasks "T030,T031" # leave T032 last to verify everything

```

## Notes
- Respect TDD: do not modify implementation files until T003–T011 are committed failing.
- When multiple tasks touch the same file, leave them unmarked for parallel execution to avoid conflicts.
- Keep hero modal accessible: verify focus handling manually after T017/T024.
- Update asset attributions in README as icons are added.

## Validation Checklist
- [ ] Each contract file has a dedicated contract test task.
- [ ] Every entity in `data-model.md` is represented in type/data tasks (T012–T013).
- [ ] Tests precede implementation tasks chronologically.
- [ ] [P] markers only assigned where files are independent.
- [ ] All tasks include absolute paths for clarity.

The following GLB models need configuration via debug mode:

1. **X-wing.glb** - Small fighter configuration
2. **Star Destroyer.glb** - Large capital ship configuration
3. **First Order Star Destroyer.glb** - Modern capital ship configuration
4. **Imperial Shuttle.glb** - Transport vessel configuration
5. **Micro Millennium Falcon.glb** - Iconic freighter configuration
6. **small venator class star destroyer.glb** - Republic ship configuration

Each model will need manual configuration through debug controls to set proper:

- Scale values for appropriate size
- Initial rotation for correct orientation
- Speed ranges for realistic movement
- Spawn zones for natural trajectories

## Acceptance Criteria

### Functional Requirements

- [ ] Renders animated starships as background overlay
- [ ] Supports up to 6 concurrent starship models
- [ ] Maintains >30fps performance on desktop, >20fps on mobile
- [ ] Handles model loading errors gracefully
- [ ] Adapts model count based on screen size
- [ ] Debug mode allows real-time configuration

### Technical Requirements

- [ ] Uses React Three Fiber for 3D rendering
- [ ] Follows established component patterns from LightsaberViewer
- [ ] Implements proper cleanup to prevent memory leaks
- [ ] Supports responsive design principles
- [ ] Integrates with existing theme system

### Testing Requirements

- [ ] All components have unit tests
- [ ] Integration tests verify animation behavior
- [ ] Performance tests validate frame rate goals
- [ ] Error handling tests cover failure scenarios
- [ ] Mobile compatibility verified on actual devices

## Notes

- All [P] tasks use different files and can run in parallel
- Verify all tests fail before implementing (TDD approach)
- Debug mode should only be enabled in development
- Performance monitoring should track FPS and memory usage
- Configuration export allows saving debug session results

## Task Generation Rules Applied

1. **From Component Contracts**: Each component → contract test + implementation
2. **From Data Model**: Each entity → type definition + validation
3. **From API Contracts**: Configuration management → utilities + tests
4. **From User Stories**: Demo page → integration test + implementation
5. **Ordering**: Setup → Tests → Core → Integration → Polish
6. **Dependencies**: Types before implementations, hooks before components
```
