We are continuing work on `mirasen-io/chessboard`.

## Handoff summary

- **Project:** `mirasen-io/chessboard` on branch `feat/v1`.
- **Current task:** move on from accepted Phase 3.8 to prepare Phase 3.9 move animation architecture + base implementation.
- **Phase 3.8 status:** accepted in substance after manual verification: drag preview initializes immediately on `pointerdown`, follows pointer smoothly, same-square pointer movement redraw works, and native text / coordinate selection during drag is prevented.
- **Confirmed 3.8 architecture now in place:** runtime owns `transientVisuals`; renderer receives `interaction` + `transientVisuals` via `RenderingContext`; old derived `drag` payload / `DragRenderInfo` was removed.
- **Confirmed input/runtime contracts from 3.8:** controller pointer move uses `onPointerMove(target: Square | null, point: BoardPoint | null)`; runtime uses `notifyDragMove(point: BoardPoint | null)`; drag start now initializes visual pointer on `pointerdown` with `dragStart(from, point)`.
- **Manual behavior confirmed in 3.8:** dragged piece “jumps into hand” immediately on `pointerdown`, drag motion is smooth, and labels/text do not get selected during dragging.
- **Known deferred topic:** repeated same-piece drag / selection behavior after `drop-to-source` was intentionally deferred to Phase 4, because proper visual observability will come with selected-square highlight.
- **Confirmed plan direction for Phase 4:** selected-square highlight extension and later UX alignment pass for repeated same-piece drag were added separately and are not part of 3.9.
- **Current 3.9 direction:** design move animation from the start for both single-piece and multi-piece committed moves; ownership stays in renderer/view layer.
- **Confirmed 3.10 dependency:** castling animation must build on the general animation model introduced in 3.9, not on a one-off special path.
- **Core 3.9 constraint:** do not reopen settled Phase 3.1–3.8 interaction/runtime architecture just to add animation.
- **Core 3.9 constraint:** do not jump ahead into full castling integration yet; first establish animation architecture and base implementation that can later support multi-piece committed moves.
- **Likely design focus for next chat:** define what animation state belongs in renderer/view layer versus runtime, how committed board transitions are observed, and how animation can coexist with current drag/render flow without leaking into semantic board state.
- **Relevant files from recent work:** `src/core/runtime/boardRuntime.ts`, renderer context/types files, `src/core/renderer/SvgRenderer.ts`, and related renderer/runtime tests.
- **Relevant planning file:** `current-plan.md` is already updated by the user; no plan-edit task is needed in the next chat.
- **Workflow constraint:** in Cline workflow, prompts during the plan -> correction -> revised plan loop must contain only delta corrections / constraint reinforcements; do not tell Cline to proceed or switch to Act. The user switches Act manually.
- **Next step:** start a new chat focused strictly on Phase 3.9 architecture-first analysis, then produce a precise Cline planning prompt for move animation base implementation.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

Focus only on **Phase 3.9 Move animation architecture + base implementation** from `current-plan.md`.

Goals:

- define a narrow animation architecture that works from the start for both:
  - normal single-piece committed moves
  - future multi-piece committed moves
- keep animation ownership in the renderer / view layer
- avoid leaking animation state into semantic board state or reopening settled interaction architecture
- prepare for later Phase 3.10 castling animation integration through the same general model

Do not:

- reopen Phase 3.1–3.8 interaction/runtime design unless a concrete blocker forces it
- implement castling-specific animation logic yet
- broaden into unrelated renderer refactors
- solve deferred Phase 4 selection/highlight UX topics here

Working mode:

1. brief architecture analysis
2. concrete recommendation for 3.9 base model
3. precise Cline prompt for plan generation
4. later focused review of the resulting plan/diff

Key design expectations:

- animation should be based on committed board transitions, not on drag visuals
- architecture should anticipate multi-piece move commits from the beginning
- renderer/view layer should own animation presentation
- keep the first implementation narrow, but avoid designing a dead-end single-piece-only model

Relevant context:

- Phase 3.8 drag visual path is already accepted and should remain undisturbed
- `RenderingContext` now already carries `interaction` + `transientVisuals`
- deferred repeated same-piece drag UX belongs to Phase 4, not this chat

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

https://github.com/mirasen-io/chessboard/tree/feat/v1

When discussing the current implementation, use this branch as the source of truth.

Sometimes you retrieve old version of files (probably due to cache), so attached also is the zip of src folder if you need to review some files.

If you need to inspect specific files, ask for them explicitly rather than assuming their contents.
Do not invent file contents.
