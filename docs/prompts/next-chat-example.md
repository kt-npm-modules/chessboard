We are continuing work on `mirasen-io/chessboard`.

## Handoff summary

- **Project:** `mirasen-io/chessboard` on branch `feat/v1`.
- **Current task:** Phase 3.8 drag visual bug-fix pass is implemented and manually verified; prepare next chat for Phase 4 follow-up work.
- **Phase 3.8 result:** accepted in substance after manual check: drag preview initializes immediately on `pointerdown`, follows pointer smoothly, same-square movement redraw works, and native text / coordinate selection during drag is prevented.
- **Confirmed 3.8 architecture:** runtime owns `transientVisuals`; renderer now receives `interaction` + `transientVisuals` through `RenderingContext`; old derived `drag` payload / `DragRenderInfo` was removed.
- **Confirmed input/runtime contracts:** controller pointer move uses `onPointerMove(target: Square | null, point: BoardPoint | null)`; runtime uses `notifyDragMove(point: BoardPoint | null)`; drag start now initializes visual pointer on `pointerdown` rather than waiting for first `pointermove`.
- **Confirmed runtime direction:** `dragStart(from, point)` initializes `transientVisuals.dragPointer` immediately; `notifyDragMove(point)` remains for subsequent drag motion updates.
- **Confirmed manual behavior:** dragged piece “jumps into hand” immediately on `pointerdown`; drag is smooth; text does not get selected while dragging.
- **Known remaining UX topic:** repeated same-piece drag / selection behavior after `drop-to-source` is not yet finalized and should be revisited only after selection becomes visually observable.
- **Confirmed decision:** do **not** chase that repeated-drag UX now in Phase 3.8; postpone it to Phase 4 after a minimal selected-square highlight extension exists.
- **Phase 4 plan additions agreed:** add **4.3a Selected-square highlight as first diagnostic interaction visual** and **4.3b UX alignment pass for repeated same-piece drag after drop-to-source**.
- **Confirmed 4.3a scope:** first interaction overlay should be a minimal selected-square highlight only; purpose is observability/manual debugging, not final UX polish; no animation and no broad annotation system yet.
- **Confirmed 4.3b scope:** after selected-square highlight exists, manually verify repeated same-piece flow against chess.com-style UX and, if needed, implement a narrow semantic alignment pass only for that flow.
- **Extension test addition agreed:** under `4.5 Extension tests`, add focused tests that selected-square highlight reflects core interaction selection state and clears when selection clears; keep tests narrow and avoid broad renderer snapshot suites unless necessary.
- **Relevant files touched in 3.8:** `src/core/input/inputAdapter.ts`, `src/core/input/interactionController.ts`, `src/core/runtime/boardRuntime.ts`, renderer context/types files, `src/core/renderer/SvgRenderer.ts`, and focused tests under `tests/core/input/`, `tests/core/runtime/`, and `tests/core/renderer/`.
- **Relevant planning file:** `current-plan.md` should be updated with the agreed new Phase 4 items and the small `4.5` test addition.
- **Workflow constraint:** for Cline work, prompts in the plan -> correction -> revised plan loop must contain only delta corrections / constraint reinforcements; do not tell Cline to proceed, start implementation, or switch to Act. The user switches Act manually in the UI.
- **Next step:** start a new chat to update `current-plan.md` with the agreed Phase 4 additions and then prepare the next narrow task around the first selected-square highlight extension.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

Update `current-plan.md` for Phase 4 using the decisions from the previous chat.

Apply these additions in the style and numbering of the existing plan:

1. Add a new Phase 4 item:
   **4.3a Selected-square highlight as first diagnostic interaction visual**
   - start interaction overlay work with the smallest useful visual: currently selected square highlight
   - treat this first step primarily as observability / manual-debug aid, not final UX polish
   - keep the initial version narrow:
     - selected square highlight only
     - no animation required
     - no broader annotation system yet
   - use it to make selection persistence / clearing behavior visible during manual interaction testing

2. Add a second new Phase 4 item:
   **4.3b UX alignment pass for repeated same-piece drag after drop-to-source**
   - after selected-square highlighting is visible, manually verify:
     - pointerdown on piece → selection + drag start
     - drop back to source → drag stop with selection persistence
     - repeated pointerdown on the same selected piece
     - repeated drop back to source
   - compare observed behavior against intended chess.com-style UX
   - if needed, implement a narrow interaction-semantic follow-up only for this flow
   - do not broaden into general interaction redesign

3. Update `4.5 Extension tests` with a small addition:
   - add focused tests for the first interaction-overlay extension pass:
     - selected-square highlight reflects core interaction selection state
     - selected-square highlight appears for the currently selected square and clears when selection clears
   - keep these tests narrow and avoid broad renderer snapshot suites unless needed

Constraints:

- Do not reopen Phase 3.8 architecture.
- Do not start Phase 3.9+ work.
- Keep the update to the plan only unless another narrow follow-up is explicitly requested.

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
