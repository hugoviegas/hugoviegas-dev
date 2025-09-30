# Implementation Plan: Visualizar objetos 3D - Star Wars Background

**Branch**: `003-visualizar-objetos-3d` | **Date**: 2025-09-29 | **Spec**: [specs/003-visualizar-objetos-3d/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-visualizar-objetos-3d/spec.md`

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

Create an animated Star Wars starships background using GLB 3D models (First Order Star Destroyer, Imperial Shuttle, Micro Millennium Falcon, small venator class star destroyer, Star Destroyer, X-wing). Following the same logic as the lightsaber implementation, starships will travel across the background in random directions with configurable positioning, scaling, and movement patterns. Initially implemented on a dedicated page for testing, then integrated as the main page background replacement.

## Technical Context

**Language/Version**: TypeScript 5.8.3, React 18.3.1  
**Primary Dependencies**: React Three Fiber (@react-three/fiber), Three.js, React Router DOM 6.30.1  
**Storage**: N/A (static 3D models)  
**Testing**: Jest, React Testing Library  
**Target Platform**: Web (desktop and mobile responsive)
**Project Type**: web - React frontend application  
**Performance Goals**: 60 fps animations, smooth model loading  
**Constraints**: Responsive design, optimized 3D performance, random movement patterns  
**Scale/Scope**: 6 starship models, multiple concurrent animations, debug controls for positioning

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Library-First Approach**: ✅ PASS - Creating reusable StarshipBackground component following established pattern from LightsaberViewer  
**Component Architecture**: ✅ PASS - Following React component patterns with clear separation of concerns  
**Performance Standards**: ✅ PASS - Using React Three Fiber for optimized 3D rendering  
**Testing Standards**: ✅ PASS - Component will have unit tests for configuration and behavior

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── StarshipBackground/      # New animated background component
│   │   ├── index.tsx           # Main component export
│   │   ├── StarshipModel.tsx   # Individual starship model component
│   │   ├── useStarshipAnimation.tsx # Animation hooks
│   │   └── starshipConfigs.ts  # Model configurations and positioning
│   └── [existing components...]
├── pages/
│   ├── StarshipDemo.tsx        # New demo page for testing
│   └── [existing pages...]
└── assets/
    └── 3d-model/
        └── Lego glb models/    # Existing GLB files
            ├── First Order Star Destroyer.glb
            ├── Imperial Shuttle.glb
            ├── Micro Millennium Falcon.glb
            ├── small venator class star destroyer.glb
            ├── Star Destroyer.glb
            └── X-wing.glb

tests/
└── components/
    └── StarshipBackground/
        └── StarshipBackground.test.tsx
```

**Structure Decision**: Web application structure with new StarshipBackground component following the established component pattern from LightsaberViewer. Demo page created first for testing, then integration as background replacement.

## Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:

   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts

_Prerequisites: research.md complete_

1. **Extract entities from feature spec** → `data-model.md`:

   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:

   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:

   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:

   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType copilot`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/\*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach

_This section describes what the /tasks command will do - DO NOT execute during /plan_

**Task Generation Strategy**:

- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- StarshipBackground component creation [P]
- StarshipModel individual component [P]
- useStarshipAnimation custom hook [P]
- Debug controls component [P]
- Configuration management utilities [P]
- Integration tests for animation behaviors
- Demo page creation for testing

**Ordering Strategy**:

- TDD order: Component tests before implementation
- Dependency order: Types → Hooks → Components → Pages
- Mark [P] for parallel execution (independent files)
- Debug components can be developed separately

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

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
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:

- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A - no violations)

---

_Based on Constitution v2.1.1 - See `/memory/constitution.md`_
