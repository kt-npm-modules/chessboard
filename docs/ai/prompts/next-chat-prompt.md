We are continuing work on `mirasen-io/chessboard`.

Follow:

- `ai-workflow-instructions.md`
- `ai-artifacts-instructions.md`

Use as project-specific references:

- `chessboard-current-plan.md`
- `chessboard-AGENTS.md` (if relevant to this task)

## First-step rule

Start with analysis and discussion readiness.

Do not generate an implementation prompt immediately after the first analysis pass.

Instead:

- understand the task
- identify any architectural or structural questions if they exist
- summarize the proposed direction briefly
- stop in a discussion-ready state

Only generate the prompt if the user explicitly asks for it or clearly signals to proceed.

## Handoff summary

We are continuing work on `@mirasen/chessboard`.

Current phase:

- the old test suite was intentionally discarded
- a new clean `tests/` tree and `tests/test-utils/` tree were created earlier
- we have now completed the full `state` subsystem test rebuild

Completed test subsystems:

1. `state/board`
2. `state/change`
3. `state/view`
4. `state/interaction`

This means the whole `state/*` block is now considered done.

What was completed in this chat sequence:

- `tests/state/board` was rebuilt in two passes:
  - first pass: `position.spec.ts`, `reducers.spec.ts`, `factory.spec.ts`
  - second pass: `coords.spec.ts`, `piece.spec.ts`, `normalize.spec.ts`, `denormalize.spec.ts`, `check.spec.ts`
- `tests/state/change` was added with:
  - `helpers.spec.ts`
  - `reducers.spec.ts`
  - `ui-move.spec.ts`
  - `factory.spec.ts`
  - plus a very small `tests/test-utils/state/change/fixtures.ts`
- `tests/state/view` was added with:
  - `reducers.spec.ts`
  - `factory.spec.ts`
- `tests/state/interaction` was added with:
  - `normalize.spec.ts`
  - `movability.spec.ts`
  - `reducers.spec.ts`
  - `factory.spec.ts`
  - plus a small `tests/test-utils/state/interaction/fixtures.ts`

Important review outcomes already resolved:

- `board/factory.spec.ts` snapshot test was strengthened to check real mutation isolation, not just different references
- `change/reducers.spec.ts` deferred UI move request no-op test was corrected to use two distinct objects with the same snapshot, so it now proves snapshot-based equality instead of same-reference identity
- `interaction/factory.spec.ts` snapshot test was strengthened to verify real mutation isolation
- `interaction/factory.spec.ts` also gained missing `clearActive()` factory-level coverage

Important constraints and decisions that remain in force:

- old tests are obsolete and must not be reused as a base
- test rebuild order remains subsystem-by-subsystem
- reusable helpers should stay minimal and only exist when repetition is real
- do not create giant god-helper layers in `tests/test-utils`
- keep spec files focused
- review remains diff-first, not report-first
- when a test claims to verify cloning/isolation, it should usually mutate the returned snapshot/input and then prove internal state did not change
- when reducer/factory logic is equality-gated, tests should prefer proving semantic equality, not just same-reference identity

Current sequencing status:

- `state/*` is done
- the next subsystem in the plan is `layout`

Likely next task shape:

- inspect `src/layout/**`
- decide whether `layout` should be done in one pass or split
- generate a PLAN prompt for Opus based on the actual current files
- then implement and review the new `tests/layout/**`

Known practical note:

- some earlier uploaded source/diff archives from this chat have expired
- if the next chat needs fresh file-level inspection from an archive rather than current repo access, attach the latest source archive again

## Task for this chat

Focus only on: planning and starting the `layout` test suite.

### Task frame

What:

- inspect the actual current `src/layout/**` files
- identify the real behavior clusters and responsibilities in `layout`
- decide the clean spec-file split for `tests/layout`
- generate a narrow PLAN prompt for Opus
- after reviewing the plan, generate the ACT prompt if the plan is solid

Not:

- do not return to `state/*`
- do not revisit README / package / site / branding work
- do not broaden into `animation`, `runtime`, `render`, `extensions`, or `wrapper`
- do not redesign production code unless a real testability blocker appears

Constraints:

- use the same workflow as in the previous steps:
  1. inspect actual files first
  2. generate PLAN prompt
  3. review Opus plan
  4. generate ACT prompt
  5. review diff
- keep test-utils minimal
- avoid giant helper infrastructure
- keep specs focused on real behavior, not decorative coverage
- prefer honest isolation/no-op/equality tests over shallow reference-only checks

Done when:

- the `layout` subsystem has a reviewed plan ready for implementation
- or, if small enough, a reviewed implementation diff ready for acceptance

## Working mode

Work architecture-first when the task has architectural risk.
Keep the step narrow.
Avoid overengineering.
Assume previously confirmed decisions remain in force unless explicitly revised.

When useful, structure the work as:

1. brief analysis
2. proposed direction, or the most relevant options if a real architectural choice exists
3. stop in a discussion-ready state
4. generate the implementation prompt only after the user explicitly asks for it or clearly signals to proceed
5. focused test updates
6. later patch review

If you notice related future issues, mention them briefly only if they materially affect this step.
Do not redesign unrelated parts.
Do not introduce speculative APIs unless clearly justified.

## Project plan reference

Use `chessboard-current-plan.md` as the roadmap reference for:

- current phase
- sequencing
- task scope context

If the current plan appears out of sync with the handoff or recently completed work, call that out briefly before relying on it.

## Codebase / project materials

Primary repository / branch:

- `mirasen-io/chessboard`
- `feat/v1`
- when repository access is needed, prefer the GitHub connector over Web/Web UI access

Optional attached materials:

- current `src` + `tests` zip
- other task-specific files if needed

If repository access may be stale, incomplete, or cached, prefer attached source artifacts for file-level review.

If this prompt refers to specific files, first look for them in the current chat attachments.

If they are not attached, then look for them in the available project sources / referenced artifacts.

When the same artifact exists in both places, prefer the attached version for the active task, because it may be the newer task-local version.

Do not assume the contents of referenced files that are not actually available.

If a materially required referenced file cannot be found in either attachments or available project sources, do not continue with substantive best-effort analysis.

Instead, briefly state which file is missing, say that it was not found in either attachments or sources, and ask the user to attach it or point to it.
