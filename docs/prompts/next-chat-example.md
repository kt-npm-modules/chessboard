We are continuing work on `kt-npm-modules/chessboard`.

## Handoff summary

- **Project:** `kt-npm-modules/chessboard` on branch `feat/v1`.
- **Current task completed:** reviewed and accepted **Phase 3.5**.
- **Phase 3.5 result:** runtime interaction snapshot observability was extended minimally for testing.
- **Confirmed implementation:** `InteractionSnapshot.interaction` in `src/core/runtime/boardRuntime.ts` now includes `destinations` and `currentTarget` as internal passthrough runtime state.
- **Confirmed boundary:** this snapshot change is internal/test-facing only; no public API expansion was accepted.
- **Confirmed tests added:** `tests/core/runtime/boardRuntime.spec.ts` now covers runtime-side interaction/drag behavior rather than duplicating controller specs.
- **Confirmed covered behaviors:** strict-movability selection state, `select(null)` clearing, drag start, `setCurrentTarget`, `cancelInteraction`, legal drop, illegal dragged drop, illegal selected non-drag drop, and one renderer-visible drag ownership check.
- **Confirmed semantic distinction:** illegal drop from active drag (“lifted-piece path”) preserves selection/destinations while clearing drag/currentTarget; illegal drop from selected non-drag (“release-targeting path”) clears all interaction fields.
- **Confirmed cleanup:** an initially weak/duplicative “strict movability flow” test was removed; a misleading release-targeting test was renamed to match actual coverage.
- **Acceptance verdict:** **Phase 3.5 accepted and closed.**
- **Plan update decided:** roadmap was recognized as missing an explicit implementation step for DOM/pointer → controller wiring after square mapping.
- **Confirmed new roadmap steps:** add **3.6 Input / UI adapter wiring** and **3.7 Input adapter tests** to `current-plan.md`.
- **3.6 scope agreed:** DOM/pointer adapter reads board-local coordinates, uses `geometry` + `mapBoardPointToSquare(...)`, feeds controller on down/move/up/cancel, updates `currentTarget`, and clears target on off-board/leave/cancel without expanding public API.
- **3.7 scope agreed:** focused adapter-path tests for DOM/pointer → controller/runtime wiring, coordinate extraction, square/`null` mapping, `currentTarget` updates, off-board/leave, and cancel/release behavior.
- **Relevant files:** `src/core/runtime/boardRuntime.ts`, `tests/core/runtime/boardRuntime.spec.ts`, `src/core/input/squareMapping.ts`, `tests/core/input/interactionController.spec.ts`, `src/core/renderer/geometry.ts`, `current-plan.md`.
- **Constraint carried forward:** do not reopen settled Phase 3.1 / 3.2 / 3.3 / 3.4 / 3.5 decisions unless the exact next step requires it.
- **Working style carried forward:** narrow, architecture-first review; inspect actual current files only; produce a precise Cline prompt only if a real gap exists.
- **Model workflow carried forward:** return to Sonnet 4.6 for ordinary narrow implementation steps; use GPT-5 selectively for architectural ambiguity or scope-discipline problems.
- **Next step:** start **Phase 3.6 Input / UI adapter wiring** only, then later review diff and follow with **Phase 3.7** adapter-path tests.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

Focus only on **Phase 3.6 Input / UI adapter wiring** from `current-plan.md`.

Goals:

- Review the current implementation only for the exact scope of **Phase 3.6**.
- Check whether a DOM/pointer adapter already exists partially or whether there are narrow gaps.
- Keep the step limited to wiring pointer/UI input into the existing controller/runtime flow using the already accepted square-mapping helper.
- Produce a brief verdict and, only if needed, a precise implementation prompt for Cline.

Do not:

- Reopen settled Phase 3.1 / 3.2 / 3.3 / 3.4 / 3.5 decisions.
- Redesign controller/runtime/renderer boundaries unless Phase 3.6 directly requires it.
- Expand into Phase 3.7 tests except to mention them briefly if they affect this step.
- Expand public API.

Working mode:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt for Cline + Sonnet 4.6 only if gaps are found
4. focused review of resulting diff later

Keep the step narrow, architecture-first, and grounded in the actual current files on branch `feat/v1`.

If specific files are needed for verification, request them explicitly rather than assuming contents.
Do not invent file contents.

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

Sometimes you retrieve old version of files (probably due to cache), so attached also is the zip of src folder if you need to review some files.

If you need to inspect specific files, ask for them explicitly rather than assuming their contents.
Do not invent file contents.
