We are continuing work on `mirasen-io/chessboard`.

Follow:

- `ai-workflow-instructions.md`
- `ai-artifacts-instructions.md`

Use as project-specific references:

- `chessboard-current-plan.md`
- `chessboard-AGENTS.md` (if relevant to this task)

## Handoff summary

- Project: `mirasen-io/chessboard` / `@mirasen/chessboard`, branch `feat/v1`.
- Phase 4.2a is complete.
- Phase 4.2b is complete.
- Completed/confirmed in 4.2b:
  - first move-derived extension `lastMove` was implemented on the generic runtime extension path
  - `lastMove` styling is configurable via factory options with chess.com-like defaults:
    - `color: 'rgb(255, 255, 51)'`
    - `opacity: 0.5`
  - runtime remains generic; no hardcoded first-party extension behavior beyond required update context
  - `lastMove` renders into `underPieces`
  - committed-move handling uses a narrow shared internal path only where justified
  - `commitMove()` must remain narrow and must not perform extension update/scheduling
  - `updateExtensions()` / `scheduleIfAnythingDirty()` must run only after the caller finishes all related state mutations
  - extension update context gained top-level layout invalidation support:
    - `layoutVersion: number`
    - `layoutChanged: boolean`
  - layout invalidation signaling stays separate from `view`
  - both `lastMove` and `selectedSquare` participate in layout-driven re-rendering
  - out-of-scope `src/index.ts` public export expansion was removed
- The plan was clarified for the next phase:
  - `4.3` remains the category-level step for interaction overlay extensions
  - `4.3a` is now the first concrete interaction-overlay task:
    - active target square + halo during drag/touch interaction
  - destination dots are explicitly deferred from this first 4.3a step
- Relevant files:
  - `src/core/runtime/boardRuntime.ts`
  - `src/core/extensions/types.ts`
  - `src/core/extensions/selectedSquare.ts`
  - `src/core/extensions/lastMove.ts`
  - `tests/core/runtime/boardRuntime.extensions.spec.ts`
  - extension-specific tests for `selectedSquare` / `lastMove`
  - `chessboard-current-plan.md`

## Task for this chat

Focus only on: **Phase 4.3 planning — interaction overlay extension**

### Task frame

What:

- plan the next category-level step for first-party interaction overlay extensions
- define the architectural scope of `4.3` before committing to the first concrete implementation substep
- confirm what should become `4.3a` inside this phase

Not:

- no implementation yet
- no wrapper/default-extension API work
- no public API shaping beyond what is strictly required
- no broad renderer/runtime redesign
- do not jump straight into 4.3a implementation planning before 4.3 is framed clearly

Constraints:

- keep interaction facts in core and interaction visuals in the extension layer
- read finalized core interaction state as the source of truth
- keep runtime generic; do not hardcode first-party overlay behavior into runtime
- preserve the current extension/runtime architecture established through 4.2a and 4.2b
- keep the step architecture-first and narrow

Done when:

- the architectural scope of `4.3` is clear
- it is clear how `4.3` differs from already-completed `selectedSquare` and `lastMove`
- the first narrow concrete substep inside `4.3` is identified and justified
- it is explicit what should remain deferred to later `4.3x` steps

### Questions to answer

- What belongs in the `4.3` interaction overlay phase as a category, versus what belongs in a concrete substep such as `4.3a`?
- How should `4.3` be distinguished from the already-existing `selectedSquare` extension?
- What is the best first concrete step inside `4.3`?
- Should `4.3a` be active target square + halo during drag/touch interaction, or should something else come first?
- What should remain deferred until after the first `4.3` substep?

### Output expectations

- files inspected first
- concise architecture decision for `4.3`
- proposed narrow definition of `4.3a`
- explicit non-goals/deferred items

## Working mode

Work architecture-first when architectural risk is present.
Keep the step narrow.
Avoid overengineering.
Assume previously confirmed decisions remain in force unless explicitly revised.

If you notice related future issues, mention them briefly only if they materially affect this step.
Do not redesign unrelated parts.
Do not introduce speculative APIs unless clearly justified.

## Project plan reference

Use `chessboard-current-plan.md` as the roadmap reference for:

- current phase
- sequencing
- task scope context

If the current plan appears out of sync with the handoff or recently completed work, call that out briefly before relying on it.

## Codebase / source materials

Primary repository / branch:

- `mirasen-io/chessboard`
- `feat/v1`
- when repository access is needed, prefer the GitHub connector over Web/Web UI access

Optional attached materials:

- current `src` + `tests` zip
- other task-specific files if needed

If repository access may be stale, incomplete, or cached, prefer attached source artifacts for file-level review.

If this prompt refers to attached files that are not actually present in the chat, do not assume their contents.
Instead, briefly say that the files may have been forgotten and ask for them only if they are materially needed.

If you need specific files that are not attached, ask for them explicitly rather than inventing contents.
