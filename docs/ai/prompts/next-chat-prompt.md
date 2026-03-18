We are continuing work on `mirasen-io/chessboard`.

Follow:

- `ai-workflow-instructions.md`
- `ai-artifacts-instructions.md`

Use as project-specific references:

- `chessboard-current-plan.md`
- `chessboard-AGENTS.md` (if relevant to this task)

## Handoff summary

- Project: `mirasen-io/chessboard` / `@mirasen/chessboard`, branch `feat/v1`.
- Phase `4.2a` is complete.
- Phase `4.2b` is complete.
- Completed/confirmed in `4.2b`:
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
- Phase `4.3` is now considered architecturally closed without code changes.
- Confirmed decisions for `4.3`:
  - this phase is for transient interaction overlay extensions
  - interaction facts stay in core and interaction visuals stay in the extension layer
  - extensions must read finalized core interaction state as the source of truth
  - no new core/runtime extension interfaces are required for this phase
  - no new overlay framework/base abstraction should be introduced at this step
- Confirmed first concrete substep:
  - `4.3a` is the first interaction overlay implementation
  - extension name: `activeTarget`
  - `activeTarget` should render active target-square highlight + halo during active drag/touch interaction
  - rendering must be gated by active interaction context, not by raw `currentTarget` alone
  - destination dots and broader move-hint visuals remain deferred
- Relevant files:
  - `src/core/runtime/boardRuntime.ts`
  - `src/core/extensions/types.ts`
  - `src/core/extensions/selectedSquare.ts`
  - `src/core/extensions/lastMove.ts`
  - `tests/core/runtime/boardRuntime.extensions.spec.ts`
  - extension-specific tests for `selectedSquare` / `lastMove`
  - `chessboard-current-plan.md`

## Task for this chat

Focus only on: **Phase 4.3a planning — `activeTarget` interaction overlay extension**

### Task frame

What:

- plan the first concrete interaction overlay implementation: `activeTarget`
- define the narrow implementation shape for active target-square highlight + halo
- confirm the minimal option surface and test scope for this step

Not:

- no implementation yet
- no destination dots
- no broader move-hint system
- no public extension API work
- no new overlay framework/base abstraction
- no broad runtime/interface redesign

Constraints:

- keep interaction facts in core and interaction visuals in the extension layer
- read finalized core interaction state as the source of truth
- keep runtime generic; do not hardcode first-party overlay behavior into runtime
- preserve the current extension/runtime architecture established through `4.2a` and `4.2b`
- gate rendering by active interaction context, not raw `currentTarget` alone
- keep the step architecture-safe and narrow

Done when:

- the narrow implementation definition of `activeTarget` is clear
- the default render predicate is clear
- the minimal extension-local option shape is clear
- the expected render slot and test scope are clear
- deferred items remain explicit

### Questions to answer

- What should the exact render predicate for `activeTarget` be?
- What is the minimal option shape for `activeTarget` in the first pass?
- Which render slot should `activeTarget` use?
- What focused tests are needed for the first implementation?
- What must remain deferred after `4.3a`?

### Output expectations

- files inspected first
- concise implementation plan for `activeTarget`
- proposed minimal options/types for the first pass
- focused test plan
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
