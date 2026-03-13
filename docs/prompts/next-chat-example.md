We are continuing work on `kt-npm-modules/chessboard`.

## Handoff summary

- **Project:** `kt-npm-modules/chessboard` on branch `feat/v1`.
- **Current task completed:** reviewed and accepted **Phase 3.4** from `current-plan.md`.
- **Phase 3.4 result:** added a pure input-layer helper for board-local coordinate → square mapping.
- **Confirmed implementation:** `src/core/input/squareMapping.ts` now provides `mapBoardPointToSquare(x, y, geometry): Square | null`.
- **Confirmed mapping model:** helper uses **O(1) arithmetic mapping** from board-local coordinates; no iteration over 64 squares.
- **Confirmed orientation inversion:** white maps top-left to `a8` / bottom-right to `h1`; black maps top-left to `h1` / bottom-right to `a8`.
- **Confirmed no-square convention:** helper returns `null` for off-board and non-finite coordinates; `null` remains the single no-square convention.
- **Confirmed architectural boundary:** Phase 3.4 stayed input-layer only; no runtime, controller, or renderer contract redesign.
- **Confirmed non-goals preserved:** no DOM event plumbing, no pointer coordinates added to runtime/renderer, no public API expansion.
- **Tests status:** focused tests for white/black mapping, off-board/null behavior, and boundary cases were added and accepted.
- **Acceptance verdict:** **Phase 3.4 accepted and closed.**
- **Relevant files:** `src/core/input/squareMapping.ts`, `tests/core/input/squareMapping.spec.ts`, `src/core/renderer/geometry.ts`, `src/core/state/coords.ts`, `current-plan.md`.
- **Constraint carried forward:** do not reopen settled Phase 3.1 / 3.2 / 3.3 / 3.4 decisions unless the exact next step requires it.
- **Working style carried forward:** narrow, architecture-first review; inspect actual current files only; produce a precise Cline prompt only if a real gap exists.
- **Next step:** start **Phase 3.5** only, using `current-plan.md` as the roadmap and keeping scope tightly limited to that phase.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

Focus only on the **next exact step after Phase 3.4** from `current-plan.md` (**Phase 3.5**).

Goals:

- Review the current implementation only for the exact scope of **Phase 3.5**.
- Check whether the current code already satisfies any part of that step or whether there are narrow gaps.
- Produce a brief verdict and, only if needed, a precise implementation prompt for Cline.

Do not:

- Reopen settled Phase 3.1 / 3.2 / 3.3 / 3.4 decisions.
- Redesign controller/runtime/renderer/input boundaries unless Phase 3.5 directly requires it.
- Expand into later Phase 3+ steps.

Working mode:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt for Cline + GPT-5 only if gaps are found
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
