We are continuing work on `kt-npm-modules/chessboard`.

## Handoff summary

- Project: `kt-npm-modules/chessboard` — MIT-licensed modern TypeScript chessboard engine with chessground-like interaction and cm-chessboard-like extension ideas.
- Current task completed: Pre-Phase 2 / `0.3 — post-cleanup validation and dead-path sweep`.
- Confirmed: `SvgRenderer` root ownership model remains `boardRoot`, `coordsRoot`, `piecesRoot`, `dragRoot`, plus reserved extension slot roots.
- Confirmed: coordinate rendering was implemented in `SvgRenderer` via `drawCoords()` in chess.com-like style, inside edge squares.
- Confirmed: rank labels render on the visual left edge in top-left square corners; file labels render on the visual bottom edge in bottom-right square corners.
- Confirmed: orientation mapping is visual, not logical: white = `a8..a1` / `a1..h1`; black = `h1..h8` / `h8..a8`.
- Confirmed: coordinate text color now uses `RenderConfig.coords.{light,dark}` for contrast-by-square semantics.
- Confirmed: `RenderConfig.coords` changed from a single string to an object `{ light, dark }`.
- Confirmed: `isLightSquare()` had a base parity bug and was fixed to classic chess parity where `a1` is dark.
- Confirmed: separate `DirtyLayer.Coords` was removed as unnecessary/error-prone.
- Confirmed: coordinates are still rendered in `coordsRoot`, but invalidation treats them as part of `DirtyLayer.Board`.
- Confirmed: current dirty layers are `Board`, `Pieces`, `Drag`, `All`.
- Confirmed: renderer now follows strict per-layer bit handling; `Board` redraw includes both board squares and coords.
- Confirmed: reducer invalidation was updated accordingly (`setPosition()` / `setOrientation()` no longer use a coords bit).
- Confirmed: focused renderer tests were updated for the new contract, and a test for `render()` before `mount()` was added.
- Constraints: keep steps narrow, architecture-first, avoid speculative APIs, avoid unrelated refactors, prefer small diff review loops.
- Relevant files: `src/core/renderer/SvgRenderer.ts`, `src/core/renderer/types.ts`, `src/core/renderer/geometry.ts`, `src/core/state/types.ts`, `src/core/state/reducers.ts`, `tests/core/renderer/svgRenderer.coords.spec.ts`, `tests/core/renderer/svgRenderer.structure.spec.ts`, `tests/core/state/reducers.spec.ts`, `current-plan.md`.
- Next step: start Phase 2 — runtime composition, beginning with the narrowest internal runtime/controller contract step rather than public API shaping.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

We are continuing work on `kt-npm-modules/chessboard`.

Focus only on: **Phase 2 — Runtime composition**, starting with the **first narrow internal step**.

Goals:

- define the minimal internal runtime/controller composition contract
- clarify how state, renderer, and invalidation connect at runtime
- keep this internal-only and architecture-first
- avoid starting drag system, extension model, or public API shaping

Do:

1. brief audit of the current runtime/composition-related code
2. identify the smallest Phase 2 step that should be implemented first
3. recommend only minimal changes needed for that step
4. prepare a precise implementation prompt for Cline + GPT-5
5. later review the patch in a narrow diff loop

Do not:

- redesign extension APIs
- start Phase 3 drag lifecycle work
- broaden into public API design
- refactor unrelated renderer/state code
- introduce speculative abstractions

Working mode:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt
4. focused test updates if needed
5. later patch review

Assume all previously confirmed Pre-Phase 2 decisions remain in force unless explicitly revised.
Keep the step narrow and internal-runtime-focused.

## Working mode

Work architecture-first.
Keep the step narrow.
Avoid overengineering.
Assume previously confirmed decisions remain in force unless explicitly revised.

Prefer:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt for Cline + GPT-5
4. focused test updates
5. later patch review

If you notice related future issues, mention them briefly only if they affect this step.
Do not redesign unrelated parts.
Do not introduce speculative APIs unless clearly justified.

## Codebase

The working branch of the project is here:

https://github.com/kt-npm-modules/chessboard/tree/feat/v1

When discussing the current implementation, use this branch as the source of truth.

If you need to inspect specific files, ask for them explicitly rather than assuming their contents.
Do not invent file contents.
