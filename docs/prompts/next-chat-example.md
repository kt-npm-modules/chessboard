We are continuing work on `kt-npm-modules/chessboard`.

## Handoff summary

Project: `kt-npm-modules/chessboard`, MIT-licensed modern TypeScript chessboard engine combining chessground-like interaction with cm-chessboard-like extension ideas.
Current task: architecture-first implementation planning before Phase 2, using the loop discuss → precise Cline prompt → patch review → next narrow step.
Completed in this chat: Pre-Phase 2 / 0.1 — `SvgRenderer` root / slot normalization.
Confirmed renderer naming: top-level renderer fields use ownership-based `...Root` naming; `DirtyLayer` remains invalidation vocabulary.
Confirmed renderer renames/removals: `root` → `svgRoot`, `layerSquares` → `boardRoot`, `layerPieces` → `piecesRoot`, `layerHighlights` removed, `layerOverlay` removed.
Confirmed renderer structure: core-owned roots are `boardRoot`, `coordsRoot`, `piecesRoot`, `dragRoot`.
Confirmed reserved extension slots: `extensionsUnderPiecesRoot`, `extensionsOverPiecesRoot`, `extensionsDragUnderRoot`, `extensionsDragOverRoot`.
Confirmed stable SVG DOM order: `defsStatic`, `boardRoot`, `coordsRoot`, `extensionsUnderPiecesRoot`, `piecesRoot`, `extensionsOverPiecesRoot`, `extensionsDragUnderRoot`, `dragRoot`, `extensionsDragOverRoot`, `defsDynamic`.
Confirmed renderer behavior change: legacy core highlight rendering was intentionally removed from `SvgRenderer`.
Confirmed bug fix: repeated render no longer breaks piece `clipPath` references in `defsDynamic`; regression test was added and passes.
Confirmed test setup: global `jsdom` is acceptable for this browser-oriented project.
Constraints: keep steps narrow, avoid overengineering, prefer patch/diff review, focused tests are required for each implementation step, aim for ~8/10 polish during architecture phases rather than endless refinement.
Constraints: do not redesign extension APIs, runtime composition, or state/snapshot/config boundaries unless the current step directly requires it.
Relevant files: `src/core/renderer/SvgRenderer.ts`, `tests/core/renderer/svgRenderer.structure.spec.ts`, `src/core/state/types.ts`, `current-plan.md`.
Intentionally not done: no extension API design, no runtime composition refactor, no state/snapshot/config boundary refactor, no `lastMove` migration, no `DirtyLayer.Highlights` / `DirtyLayer.LastMove` cleanup, no coords or drag rendering.
Next step: Pre-Phase 2 / 0.2 — post-0.1 renderer cleanup and dead path confirmation.
Goal of next step: confirm no dead renderer coupling remains after highlight removal, keep `DirtyLayer` unchanged for now, and avoid touching runtime/state/extension design.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for this chat

Focus only on: Pre-Phase 2 / 0.2 — post-0.1 renderer cleanup and dead path confirmation.

Goals:

- review `SvgRenderer` after 0.1 and confirm no dead renderer coupling remains from the removed core highlight model
- confirm `render()` no longer performs any renderer-specific work for legacy highlight/lastMove paths
- confirm no dead helper logic, stale assumptions, or leftover renderer-only highlight code remains
- keep `DirtyLayer` definitions unchanged in this step unless dead references inside the renderer require removal of handling only
- include focused tests only if needed for this cleanup step
- prepare a precise implementation prompt for Cline + GPT-5

Do not:

- design extension APIs yet
- refactor runtime composition yet
- refactor state/snapshot/render config yet
- migrate `lastMove` out of core state yet
- remove `DirtyLayer.Highlights` or `DirtyLayer.LastMove` from the shared invalidation vocabulary yet

Working mode:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt for Cline + GPT-5
4. focused test updates
5. later patch review

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
