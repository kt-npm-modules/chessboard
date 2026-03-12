We are continuing work on `kt-npm-modules/chessboard`.

## Handoff summary

- **Project:** `kt-npm-modules/chessboard` on branch `feat/v1`.
- **Current task:** Phase 2.4 runtime test tightening was completed; next step is Phase 2.5 from the plan.
- **Confirmed decisions:** board/view split remains final; do not reopen settled architecture.
- **Board state:** `BoardStateInternal` owns only `pieces`, `ids`, `turn`, `nextId`; `BoardStateSnapshot` exposes only `pieces`, `ids`, `turn`.
- **View state:** `ViewStateInternal` owns `orientation`, `selected`, `movability`; `ViewStateSnapshot` mirrors only view-owned state.
- **Invalidation:** separate internal plumbing state; reducers use `InvalidationWriter`; runtime schedules only after successful reducers that take invalidation.
- **Runtime shape:** runtime owns `boardState`, `viewState`, and `invalidationState`; scheduler works with `BoardStateSnapshot` and `InvalidationStateSnapshot`.
- **Renderer contract:** core renderer does not depend on full view state; orientation for core rendering comes through geometry, not board snapshot.
- **API decisions:** `move()` returns `Move`; simple setters return `boolean`.
- **Phase 2.4 result:** runtime wiring coverage is now strong enough to mark the step complete, assuming local tests pass.
- **Phase 2.4 tests added:** coalescing multiple scheduling mutations into one render; `setOrientation()` render receives `DirtyLayer.All`; `move()` render receives `DirtyLayer.Pieces` plus dirty source/destination squares.
- **Constraints:** keep steps narrow; no redesign of runtime architecture; no speculative APIs; mirror test structure to source structure.
- **Relevant files:** `tests/core/runtime/boardRuntime.spec.ts`, `src/core/runtime/boardRuntime.ts`, `src/core/scheduler/{scheduler,invalidationState,reducers,types}.ts`, `src/core/state/{boardState,viewState,boardReducers,viewReducers,boardTypes,viewTypes}.ts`, and `current-plan.md`.
- **Patch review verdict:** the Phase 2.4 test diff was accepted as narrow and sufficient.
- **Next step:** start Phase 2.5 only; review the plan, inspect the relevant current files, and keep the work limited to that phase’s scope.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

Focus only on **Phase 2.5** from `current-plan.md`.

Goals:

- Review the current implementation only for the exact scope of Phase 2.5.
- Check whether the current code already satisfies the step or whether there are narrow gaps.
- Produce a brief verdict and, only if needed, a precise implementation prompt for Cline.

Do not:

- Reopen the board/view split or redesign settled runtime architecture.
- Rework Phase 2.4 runtime tests unless a Phase 2.5 issue directly depends on them.
- Expand into later phases.

Working mode:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt for Cline + GPT-5 only if gaps are found
4. focused review of resulting diff later

Use the current branch `feat/v1` and ask for specific files if needed.
Do not invent file contents.
Keep the step narrow and architecture-first.

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
