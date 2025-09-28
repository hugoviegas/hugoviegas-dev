# Research: Visualizar objetos 3D (Bricks viewer)

## Decision: Viewer approach

- Chosen: Use an in-browser WebGL viewer integrated in the existing React + Vite frontend. This keeps the feature simple and self-contained for portfolio display.

## Rationale

- r3f (@react-three/fiber) + drei provide concise React bindings and utilities (loaders, controls) that fit the repo's React setup.
- OBJ/MTL loading is supported via three/examples loaders (MTLLoader + OBJLoader). Textures in `src/assets/3d-model/textures` can be resolved relative to MTL paths.
- No backend changes required; assets are static files served by the frontend.

## Alternatives considered

- Use a lightweight <model-viewer> web component (simpler API) — rejected because it lacks fine-grained control for animations and MTL/texture handling for complex Lego parts.
- Server-side pre-processing / glTF conversion — rejected for now to keep workflow simple; can be revisited for performance.

## Outstanding unknowns

- Large texture sizes and performance tuning (user opted out of explicit targets).

## Output

- Plan: implement a React page `/bricks` using r3f, loaders for OBJ/MTL, Orbit-like controls limited to rotate+zoom, automatic rotation with 10s resume.
