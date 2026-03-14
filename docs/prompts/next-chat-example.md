We are continuing work on `mirasen-io/chessboard`.

## Handoff summary

- **Project:** `kt-npm-modules/chessboard` on branch `feat/v1`.
- **Phase status:** Phase 3.1–3.7 is accepted and closed; manual runtime playground now mounts and basic runtime interaction works.
- **Current task:** prepare Phase 3 follow-up work for visual/runtime bug fixes and animation.
- **Confirmed decisions:** add **3.8 Drag visual bug-fix pass**, **3.9 Move animation architecture + base implementation**, **3.10 Castling animation integration** to `current-plan.md`.
- **Confirmed 3.8 scope:** active drag currently commits moves on release but drag preview is missing; fix drag visual path without reopening settled interaction architecture.
- **Confirmed 3.8 extra bug:** prevent native text selection / coordinate-label selection during active board dragging.
- **Confirmed preferred 3.8 direction:** do not overload `setCurrentTarget(...)` with implicit drag-redraw semantics.
- **Confirmed runtime/controller direction:** extend `InteractionRuntimeSurface` with a separate drag-motion redraw signal (preferred name discussed: `notifyDragMove()`), while keeping `setCurrentTarget(...)` as semantic target update only.
- **Confirmed controller behavior for 3.8:** on pointer move, update target square; if a drag session exists, also notify drag movement for transient drag visual redraw.
- **Confirmed runtime behavior for 3.8:** `notifyDragMove()` should mark `DirtyLayer.Drag` and schedule render, even when pointer movement stays within the same square.
- **Confirmed reason:** same-square pointer movement may leave semantic target unchanged, but drag visuals still must rerender because transient pointer-position visuals move.
- **Confirmed test gap:** current tests do not catch missing drag redraw on pointer move; add/update drag tests to verify rerender after `onPointerMove`, especially for same-square movement.
- **Confirmed 3.9 direction:** move animation must be designed from the start for both single-piece and multi-piece committed moves; ownership stays in renderer/view layer.
- **Confirmed 3.10 direction:** castling animation should use the general animation model from 3.9, not a separate one-off system.
- **Relevant files:** `current-plan.md`, `src/core/input/interactionController.ts`, `src/core/runtime/boardRuntime.ts`, `src/core/renderer/SvgRenderer.ts`, `src/core/renderer/assets.ts`, `tests/core/input/inputAdapter.spec.ts`, runtime/manual playground files under `tests/chessboard-test`.
- **Related fix already found:** asset URLs in renderer needed correction to reach package-level `assets/` from built `dist/` files.
- **Next step:** start a new chat focused on **3.8 Drag visual bug-fix pass**, beginning with runtime/controller/renderer integration for drag redraw and the missing drag-preview behavior, then update tests accordingly.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

Focus only on **Phase 3.8 Drag visual bug-fix pass** from `current-plan.md`.

Goals:

- Investigate why active drag is not visually rendered in the runtime/manual sandbox.
- Confirm whether drag interaction is starting correctly and why drag preview is missing while move commit on release already works.
- Implement the preferred fix direction:
  - keep `setCurrentTarget(...)` as semantic target update
  - add a separate drag-motion redraw signal on `InteractionRuntimeSurface` (for example `notifyDragMove()`)
  - controller should update target on pointer move and, when a drag session exists, also notify drag movement
  - runtime should mark `DirtyLayer.Drag` and schedule render for drag-motion redraw, including same-square pointer movement
- Prevent native text selection / coordinate-label selection during active board dragging.
- Add/update focused tests so active drag redraw is verified after pointer move, especially when movement stays within the same square.

Do not:

- Reopen settled Phase 3.1–3.7 interaction architecture unless a concrete bug proves it necessary.
- Start Phase 3.9 move animation work yet.
- Broaden into unrelated renderer refactors.

Working mode:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt for Cline
4. focused review of resulting diff later

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
