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
   → Integration: Demo page, background integration
   → Polish: Unit tests, performance optimization, documentation
4. Apply task rules ✓
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Create parallel execution examples ✓
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` at repository root for React components
- **Tests**: `src/components/StarshipBackground/__tests__/`
- All paths relative to repository root: `C:\Users\hugov\OneDrive\Documentos\GitHub\evolution-path`

## Phase 3.1: Setup

- [x] T001 Install React Three Fiber dependencies (@react-three/fiber, @react-three/drei, three, @types/three)
- [x] T002 [P] Create TypeScript type definitions in `src/components/StarshipBackground/types.ts`
- [x] T003 [P] Create component directory structure `src/components/StarshipBackground/`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T004 [P] Component contract test for StarshipBackground in `src/components/StarshipBackground/__tests__/StarshipBackground.test.tsx`
- [x] T005 [P] Component contract test for StarshipModel in `src/components/StarshipBackground/__tests__/StarshipModel.test.tsx`
- [x] T006 [P] Hook contract test for useStarshipAnimation in `src/components/StarshipBackground/__tests__/useStarshipAnimation.test.tsx`
- [x] T007 [P] Integration test for starship spawning and animation in `src/components/StarshipBackground/__tests__/StarshipAnimation.integration.test.tsx`
- [x] T008 [P] Configuration validation test in `src/components/StarshipBackground/__tests__/starshipConfigs.test.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T009 [P] StarshipConfig and related types implementation in `src/components/StarshipBackground/types.ts`
- [x] T010 [P] Default starship configurations in `src/components/StarshipBackground/starshipConfigs.ts`
- [x] T011 [P] useStarshipAnimation custom hook in `src/components/StarshipBackground/useStarshipAnimation.tsx`
- [x] T012 [P] StarshipModel component in `src/components/StarshipBackground/StarshipModel.tsx`
- [x] T013 StarshipBackground main component in `src/components/StarshipBackground/index.tsx`
- [x] T014 [P] Configuration validation utilities in `src/components/StarshipBackground/utils.ts`
- [x] T015 [P] Performance monitoring utilities in `src/components/StarshipBackground/performanceUtils.ts`

## Phase 3.4: Debug and Development Tools

- [x] T016 [P] Debug controls component in `src/components/StarshipBackground/DebugControls.tsx`
- [x] T017 [P] Debug overlay component in `src/components/StarshipBackground/DebugOverlay.tsx`
- [x] T018 [P] Configuration export/import utilities in `src/components/StarshipBackground/configUtils.ts`

## Phase 3.5: Integration and Pages

- [x] T019 Create StarshipDemo page in `src/pages/StarshipDemo.tsx`
- [x] T020 Add StarshipDemo route to router configuration in `src/App.tsx`
- [x] T021 Update navigation to include demo page link

## Phase 3.6: Background Integration

- [x] T022 Integrate StarshipBackground into main Index page in `src/pages/Index.tsx`
- [x] T023 Add responsive configuration for mobile devices
- [x] T024 Implement performance-based adaptive quality settings

## Phase 3.7: Polish and Optimization

- [x] T025 [P] Unit tests for configuration validation in `src/components/StarshipBackground/__tests__/validation.test.ts`
- [x] T026 [P] Unit tests for performance monitoring in `src/components/StarshipBackground/__tests__/performance.test.ts`
- [x] T027 [P] Performance tests for frame rate under load in `src/components/StarshipBackground/__tests__/performance.integration.test.tsx`
- [x] T028 [P] Mobile device compatibility tests
- [x] T029 Error boundary implementation for 3D rendering failures
- [x] T030 Memory leak prevention and cleanup verification
- [x] T031 [P] Update component documentation and usage examples

## Dependencies

### Critical Path

- Setup (T001-T003) → Tests (T004-T008) → Core Implementation (T009-T015)
- T009 (types) blocks T010, T011, T012 (implementations depend on types)
- T011 (hook) blocks T012, T013 (components use hook)
- T012 (StarshipModel) blocks T013 (StarshipBackground uses StarshipModel)
- Core Implementation (T009-T015) → Integration (T019-T021)
- Integration (T019-T024) → Polish (T025-T031)

### Independent Parallel Tracks

- Debug tools (T016-T018) can be developed parallel to core implementation
- Tests within same phase can run parallel (different files)
- Documentation and optimization tasks (T025-T031) are mostly independent

## Parallel Execution Examples

### Phase 3.2: Tests (All can run in parallel)

```bash
# Launch T004-T008 together:
Task: "Component contract test for StarshipBackground in src/components/StarshipBackground/__tests__/StarshipBackground.test.tsx"
Task: "Component contract test for StarshipModel in src/components/StarshipBackground/__tests__/StarshipModel.test.tsx"
Task: "Hook contract test for useStarshipAnimation in src/components/StarshipBackground/__tests__/useStarshipAnimation.test.tsx"
Task: "Integration test for starship spawning in src/components/StarshipBackground/__tests__/StarshipAnimation.integration.test.tsx"
Task: "Configuration validation test in src/components/StarshipBackground/__tests__/starshipConfigs.test.ts"
```

### Phase 3.3: Core Implementation (After T009 completes)

```bash
# Launch T010-T012, T014-T015 together (T013 waits for T011, T012):
Task: "Default starship configurations in src/components/StarshipBackground/starshipConfigs.ts"
Task: "useStarshipAnimation custom hook in src/components/StarshipBackground/useStarshipAnimation.tsx"
Task: "StarshipModel component in src/components/StarshipBackground/StarshipModel.tsx"
Task: "Configuration validation utilities in src/components/StarshipBackground/utils.ts"
Task: "Performance monitoring utilities in src/components/StarshipBackground/performanceUtils.ts"
```

### Phase 3.4: Debug Tools (All parallel)

```bash
# Launch T016-T018 together:
Task: "Debug controls component in src/components/StarshipBackground/DebugControls.tsx"
Task: "Debug overlay component in src/components/StarshipBackground/DebugOverlay.tsx"
Task: "Configuration export/import utilities in src/components/StarshipBackground/configUtils.ts"
```

## Model Configuration Tasks

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
