We are continuing work on `kt-npm-modules/chessboard`.

## Handoff summary

- Project: `kt-npm-modules/chessboard` — MIT-licensed modern TypeScript chessboard engine with chessground-like interaction and cm-chessboard-like extension ideas.
- Current task completed: Phase 2.1 — first narrow runtime composition step.
- Confirmed: internal runtime is implemented as POJO/factory style (`createBoardRuntime(...)`), not a class.
- Confirmed: runtime is the main internal orchestrator of board lifecycle; renderer must not be queried for mount state.
- Confirmed: runtime owns mount state, host-derived board size, render geometry, scheduler wiring, and render permission.
- Confirmed: `mount(container)` measures and validates host size before mounting renderer.
- Confirmed: board size is host-derived via `Math.min(container.clientWidth, container.clientHeight)`.
- Confirmed: geometry is immutable derived data; runtime recreates geometry on orientation change instead of mutating it.
- Confirmed: initial runtime redraw marks `DirtyLayer.Board | DirtyLayer.Pieces`, not `DirtyLayer.All`.
- Confirmed: pre-mount state mutations are allowed; renderer must not be called before mount.
- Confirmed: repeated `mount()` is rejected; invalid zero/non-positive container size throws.
- Confirmed: `setTurn()` was intentionally excluded from Phase 2.1 runtime because it currently has no core render consequence.
- Confirmed: runtime remains internal-only; no public export from `src/index.ts`.
- Confirmed: runtime tests were tightened without adding testing-only production APIs or scheduler exposure.
- Constraints: keep steps narrow, architecture-first, internal-only until justified; avoid public API shaping, drag/input work, extension redesign, speculative abstractions, and unrelated refactors.
- Relevant files: `src/core/runtime/boardRuntime.ts`, `tests/core/runtime/boardRuntime.spec.ts`, `src/core/scheduler/scheduler.ts`, `src/core/scheduler/invalidation.ts`, `src/core/renderer/SvgRenderer.ts`, `src/core/renderer/geometry.ts`, `src/core/state/boardState.ts`, `src/core/state/reducers.ts`, `src/core/state/types.ts`, `current-plan.md`.
- Next step: Phase 2.2 — add runtime-owned host resize / geometry refresh handling, still without entering input, drag lifecycle, extension model, or public API shaping.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

We are continuing work on `kt-npm-modules/chessboard`.

Focus only on: **Phase 2.2 — runtime-owned host resize / geometry refresh**.

Goals:

- define the minimal internal resize/reflow step after Phase 2.1 runtime composition
- make runtime react to host size changes and refresh geometry
- keep this internal-only and architecture-first
- avoid starting input/controller work, drag lifecycle, extension model, or public API shaping

Do:

1. brief audit of current runtime + geometry + scheduler behavior relevant to resize
2. identify the smallest Phase 2.2 step that should be implemented first
3. recommend only minimal changes needed for that step
4. prepare a precise implementation prompt for Cline + GPT-5/Sonnet
5. later review the patch in a narrow diff loop

Do not:

- redesign renderer contracts unless strictly necessary
- start Phase 3 drag work
- broaden into public API design
- refactor unrelated state/renderer code
- introduce speculative abstractions

Working mode:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt
4. focused test updates if needed
5. later patch review

Assume all confirmed Phase 2.1 decisions remain in force unless explicitly revised.

Relevant baseline from previous chat:

- runtime already owns mount state, host-derived board size, geometry, scheduler wiring, and render permission
- board size is currently measured from host via `Math.min(container.clientWidth, container.clientHeight)`
- geometry is immutable and recreated on orientation change
- resize observation/reflow was intentionally not implemented in Phase 2.1 and is the next narrow step

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
