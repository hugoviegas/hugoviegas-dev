# Tasks: Visualizar objetos 3D (Bricks viewer)

**Input**: Design docs in `specs/003-visualizar-objetos-3d/` (plan.md, research.md, spec.md)

## Execution Flow

Setup → Tests (TDD) → Implementation → Integration → Polish

### Phase 1: Setup

- T001 Install runtime dependencies required by the viewer (adds packages to package.json)

  - Path: repo root `package.json`
  - Description: Add `three`, `@react-three/fiber`, and `@react-three/drei` as dependencies. Commit package.json and lockfile.
  - Notes: This is a single-file change (no [P]).

- T002 Project lint/format check
  - Path: repo root (existing eslint/prettier config)
  - Description: Run lint and format to ensure new files meet project standards. Add any minimal config if missing.
  - Notes: Can be executed in parallel with other setup tasks [P].

### Phase 2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE Implementation

**CRITICAL**: Tests should be added and must fail before implementation.

- T003 [P] Contract test: viewer route exists and returns 200

  - Path: `tests/contract/test_bricks_route.test.ts` (new)
  - Description: Add a contract test that requests GET `/bricks` and asserts HTTP 200 and content-type text/html. This should fail initially.

- T004 [P] Integration test: model loads on page and canvas visible
  - Path: `tests/integration/test_bricks_viewer.test.ts` (new)
  - Description: End-to-end test (puppeteer/playwright style) that opens `/bricks`, waits for a canvas element, and asserts that the OBJ loader was attempted (e.g., console log or network request to `/src/assets/3d-model/obiwan-3d.obj`). This test should fail initially.

### Phase 3: Core Implementation (after tests fail)

- T005 Create page component for `/bricks`

  - Path: `src/pages/Bricks.tsx` or `src/pages/bricks.tsx` (follow project's routing convention)
  - Description: Create a React page that renders the site `Navbar` and a main area with a full-size canvas placeholder for the 3D viewer. Export default page for routing.

- T006 Create viewer component using r3f

  - Path: `src/components/ThreeViewer/Viewer.tsx` and `src/components/ThreeViewer/index.tsx`
  - Description: Implement a viewer that mounts `<Canvas>` from `@react-three/fiber`, loads `src/assets/3d-model/obiwan-3d.obj` via `MTLLoader` + `OBJLoader` (or `useLoader` helpers), applies basic lighting, sets a static frontal camera, and starts a slow automatic rotation animation.
  - Requirements: Click-drag rotates the object, mouse scroll zooms; panning disabled. Automatic rotation should pause on interaction and resume after 10s idle.

- T007 Wire the page to use the Viewer component

  - Path: `src/pages/Bricks.tsx` (same as T005)
  - Description: Import and render `ThreeViewer` inside the main area; ensure the Navbar link back to home is present.

- T008 Add dark/light background support
  - Path: `src/components/ThreeViewer/Viewer.tsx` and possibly theme files
  - Description: Respect existing site theme if available, otherwise provide a toggle or CSS classes to show dark/light background behind the canvas.

### Phase 4: Integration & Static Assets

- T009 Ensure assets are reachable and paths resolved

  - Path: `src/assets/3d-model/` and public serving configuration
  - Description: Verify `obiwan-3d.obj`, `obiwan-3d.mtl`, and textures load correctly. Adjust relative paths or copy textures into public folder if needed.

- T010 Error handling: show placeholder on load failure
  - Path: `src/components/ThreeViewer/Viewer.tsx` and `public/placeholder.svg`
  - Description: Implement graceful error UI: when loader errors, render placeholder and friendly message.

### Phase 5: Polish & Tests

- T011 [P] Unit test: Viewer component basic render

  - Path: `tests/unit/test_viewer_render.test.tsx`
  - Description: Render `Viewer` in test and assert canvas mounts; mock loader to avoid network.

- T012 Integration test: interaction behavior

  - Path: `tests/integration/test_bricks_interaction.test.ts`
  - Description: Verify click-drag pauses rotation and rotation resumes after 10s. This can be an end-to-end test simulating input events.

- T013 [P] Accessibility check

  - Path: `tests/accessibility/test_bricks_a11y.test.ts` or integrate with axe
  - Description: Ensure canvas has appropriate labels/fallbacks; verify keyboard accessibility where relevant.

- T014 [P] Docs: update `specs/003-visualizar-objetos-3d/quickstart.md` and README with how to run the viewer locally
  - Path: `specs/003-visualizar-objetos-3d/quickstart.md`, `README.md`
  - Description: Add final quickstart and troubleshooting notes.

### Polish (ad-hoc)

- T014a [X] Model-viewer polish: add glow overlay + pulsing light + smoother motion
  - Path: `src/pages/LightsaberViewerMV.tsx`, `src/styles/lightsaber-viewer.css`
  - Description: Implemented a CSS glow overlay, pulse animation, and configurable amplitude/speed motion for a quick visual effect without heavy native deps.

## Parallel execution groups

- Group A [P]: T003, T004 (tests can be created in parallel)
- Group B [P]: T011, T013, T014 (unit/docs/a11y)

## Task ordering & dependencies (short)

- Setup (T001/T002) must run before Tests (T003/T004) and Implementation (T005-T008).
- Tests (T003/T004) must be added and fail before Implementation (T005-T008).
- T005/T006 must exist before T007.
- T009 and T010 are integration tasks after the viewer exists.

## Execution notes

- Use project routing conventions (check `src/pages` naming and route registration).
- When adding package.json deps, run `npm install` and commit `package-lock.json`/`bun.lockb` as appropriate.
- For OBJ/MTL loading in r3f, prefer the `useLoader` pattern and three/examples loaders.

---

Generated by tasks workflow for feature: Visualizar objetos 3D (Bricks viewer)
