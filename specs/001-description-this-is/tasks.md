# Tasks: Personal Portfolio UI Fixes & Enhancements

**Input**: Design documents from `/specs/001-description-this-is/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → Tech stack: TypeScript 5.8.3, React 18.3.1, Tailwind CSS 3.4.17
   → Structure: Web application (frontend only)
2. Load optional design documents:
   → data-model.md: Extract entities → model/utility tasks
   → contracts/: 3 contract files → 3 contract test tasks
   → research.md: Extract decisions → setup and implementation tasks
3. Generate tasks by category:
   → Setup: Project structure, dependencies, testing framework
   → Tests: Contract tests, integration tests, unit tests
   → Core: Time utilities, translation updates, layout fixes
   → Integration: Component integration, state management
   → Polish: Performance, accessibility, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests? Yes
   → All entities have models? Yes
   → All endpoints implemented? N/A (frontend only)
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `src/` at repository root
- All paths are absolute for clarity

## Phase 3.1: Setup

- [x] T001 Set up testing framework (Vitest + React Testing Library) in package.json
- [x] T002 Create test directory structure in src/test/
- [x] T003 [P] Configure ESLint rules for test files

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T004 [P] Contract test for contact form API in src/test/contracts/test-contact-form-api.test.ts
- [x] T005 [P] Contract test for translation system in src/test/contracts/test-translation-system.test.ts
- [x] T006 [P] Contract test for time utilities in src/test/contracts/test-time-utils.test.ts
- [ ] T007 [P] Integration test for time-based greeting display in src/test/integration/test-time-greeting.test.tsx
- [ ] T008 [P] Integration test for language switching in src/test/integration/test-language-toggle.test.tsx
- [ ] T009 [P] Integration test for layout consistency in src/test/integration/test-layout-consistency.test.tsx

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T010 [P] Create time utilities in src/lib/time-utils.ts
- [ ] T011 [P] Add time-based greeting translations in src/config/translations.ts
- [ ] T012 [P] Update HeroSection with dynamic greeting in src/components/HeroSection.tsx
- [x] T013 [P] Fix TopControls layout positioning in src/components/TopControls.tsx
- [x] T014 [P] Fix Navbar positioning to prevent overlap in src/components/Navbar.tsx
- [ ] T015 [P] Add missing Portuguese translations in src/config/translations.ts
- [ ] T016 [P] Create reusable ProjectCard component in src/components/ProjectCard.tsx
- [ ] T017 [P] Add ARIA labels and accessibility improvements in src/components/
- [ ] T018 [P] Optimize animation performance with will-change in src/components/

## Phase 3.4: Integration

- [ ] T019 Connect time utilities to HeroSection component
- [ ] T020 Integrate translation updates across all components
- [ ] T021 Implement proper error boundaries for robustness
- [ ] T022 Add performance monitoring and metrics
- [ ] T023 Implement lazy loading for heavy components

## Phase 3.5: Polish

- [ ] T024 [P] Unit tests for time utilities in src/test/unit/test-time-utils.test.ts
- [ ] T025 [P] Unit tests for translation functions in src/test/unit/test-translations.test.ts
- [ ] T026 [P] Unit tests for form validation in src/test/unit/test-form-validation.test.ts
- [ ] T027 Performance optimization (<3s load time)
- [ ] T028 [P] Update component documentation in src/components/README.md
- [ ] T029 [P] Add TypeScript strict mode and type safety improvements
- [ ] T030 Final integration testing and bug fixes

## Dependencies

- Tests (T004-T009) before implementation (T010-T018)
- T010 blocks T019 (time utilities needed for integration)
- T011 blocks T020 (translations needed for integration)
- T013-T014 must be done together (layout consistency)
- Implementation (T010-T023) before polish (T024-T030)

## Parallel Example

```
# Launch T004-T006 together (contract tests):
Task: "Contract test for contact form API in src/test/contracts/test-contact-form-api.test.ts"
Task: "Contract test for translation system in src/test/contracts/test-translation-system.test.ts"
Task: "Contract test for time utilities in src/test/contracts/test-time-utils.test.ts"

# Launch T007-T009 together (integration tests):
Task: "Integration test for time-based greeting display in src/test/integration/test-time-greeting.test.tsx"
Task: "Integration test for language switching in src/test/integration/test-language-toggle.test.tsx"
Task: "Integration test for layout consistency in src/test/integration/test-layout-consistency.test.tsx"
```

## Task Details

### T001-T003: Setup Tasks

**Goal**: Establish testing infrastructure and development environment

- Install Jest, React Testing Library, and testing utilities
- Create test directory structure following conventions
- Configure ESLint for test files

### T004-T006: Contract Tests

**Goal**: Validate API contracts and external integrations

- Test contact form submission to Web3Forms
- Test translation system functionality
- Test time utility calculations

### T007-T009: Integration Tests

**Goal**: Test end-to-end user scenarios

- Test greeting changes based on time
- Test language switching across components
- Test layout consistency on different screen sizes

### T010-T018: Core Implementation

**Goal**: Implement the main features and fixes

- Create time-based greeting utilities
- Update translations for new features
- Fix layout positioning issues
- Add accessibility improvements
- Optimize performance

### T019-T023: Integration Tasks

**Goal**: Connect components and ensure proper data flow

- Wire up time utilities to UI components
- Ensure translation updates propagate correctly
- Add error handling and monitoring

### T024-T030: Polish Tasks

**Goal**: Final optimizations and quality improvements

- Add comprehensive unit test coverage
- Optimize performance metrics
- Update documentation
- Ensure type safety and code quality

## Validation Checklist

_GATE: Checked by main() before returning_

- [x] All contracts have corresponding tests (3 contracts → 3 tests)
- [x] All entities have model/utility tasks (4 entities → 4+ tasks)
- [x] All tests come before implementation (TDD compliance)
- [x] Parallel tasks truly independent (different file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Dependencies properly mapped and ordered

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- Verify tests fail before implementing (red-green-refactor cycle)
- Commit after each task completion
- Test on multiple browsers and screen sizes
- Maintain existing design aesthetic while fixing issues
- Ensure Portuguese translations are complete and accurate
- Focus on performance: <3s load time, smooth animations
- Prepare for future project additions with extensible structure
