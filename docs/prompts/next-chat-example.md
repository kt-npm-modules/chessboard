We are continuing work on `kt-npm-modules/chessboard`.

## Handoff summary

- **Project:** `kt-npm-modules/chessboard` on branch `feat/v1`.
- **Current task completed:** **Phase 3.1** is implemented, reviewed, and accepted.
- **Phase 3.1 result:** core now has a dedicated `interactionState`; `selected` no longer lives in `viewState`.
- **Confirmed state split:** `boardState` = board facts; `viewState` = presentation/config + interaction policy config; `interactionState` = active interaction facts.
- **Confirmed `viewState` contents:** `orientation` and `movability` remain in `viewState`.
- **Confirmed `interactionState` contents:** `selectedSquare`, `destinations`, `dragSession`, `currentTarget`.
- **Confirmed selection modeling:** selected piece context is **derived from board state + selectedSquare**; no stored `selectedPiece` or selection object.
- **Confirmed drag modeling:** `DragSession` is minimal and currently stores only `fromSquare`.
- **Confirmed target modeling:** `currentTarget` is the square under active interaction focus/pointer; it is not restricted to valid destinations.
- **Confirmed validity rule:** target validity is derived separately via membership in `destinations`; `currentTarget` is a pointer fact, not a legality fact.
- **Confirmed destinations modeling:** `interactionState.destinations` is the **active destination set for the current selected/drag source only**, not the full strict movability map.
- **Runtime wiring:** `runtime.select()` now routes through `interactionState`; `setBoardPosition()` clears interaction state via `clearInteraction(...)`.
- **Tests added/updated:** new interaction state/reducer tests plus focused runtime wiring tests; local tests pass.
- **Constraints preserved:** keep steps narrow; no reopening settled board/view/runtime architecture; no Phase 3.2+ behavior; no renderer redesign; no speculative public API expansion.
- **Relevant files:** `src/core/state/viewTypes.ts`, `src/core/state/viewState.ts`, `src/core/state/viewReducers.ts`, `src/core/state/interactionTypes.ts`, `src/core/state/interactionState.ts`, `src/core/state/interactionReducers.ts`, `src/core/runtime/boardRuntime.ts`, `tests/core/state/*`, `tests/core/runtime/boardRuntime.spec.ts`, `current-plan.md`.
- **Review verdict:** Phase 3.1 accepted and closed.
- **Next step:** start the **next exact step from `current-plan.md`** only, using the same narrow architecture-first review process before implementation.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

Focus only on the **next exact step after Phase 3.1** from `current-plan.md`.

Goals:

- Review the current implementation only for the exact scope of that step.
- Check whether the current code already satisfies the step or whether there are narrow gaps.
- Produce a brief verdict and, only if needed, a precise implementation prompt for Cline.

Do not:

- Reopen the settled board/view/runtime split.
- Rework Phase 3.1 unless the next step directly depends on it.
- Expand into later Phase 3+ steps.

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
