We are continuing work on `mirasen-io/chessboard`.

## Handoff Summary — Phase 3.10 animation architecture refactor + castling integration

- Project: `mirasen-io/chessboard` / `@mirasen/chessboard`, branch `feat/v1`.
- Phase 3.9 is effectively complete and manually verified.
- Current shipped state from 3.9:
  - ordinary committed move animation works,
  - legal drag-drop completion skips committed animation,
  - legal non-drag completion still animates,
  - `setBoardPosition(...)` does not falsely animate,
  - suppression is unified through piece IDs in `SvgRenderer`,
  - renderer-side transient animation overlay works in practice.
- Important new decision: do **not** continue 3.10 as a narrow castling-only addition on top of the current 3.9 renderer-owned orchestration.
- Reason: that would likely become a temporary special-case path and create migration debt.
- New 3.10 intent: refactor committed animation architecture into a more general pipeline, then migrate ordinary move animation onto it, and implement castling on the same pipeline.
- Target conceptual model:
  - board state is committed **before** animation,
  - animation is presentation over committed state,
  - renderer should not own animation orchestration/lifecycle long-term.
- Desired responsibilities:
  - **Runtime/Core** computes animation input from `prev -> next` renderable piece placements,
  - **Animator** owns RAF/timing/lifecycle of active animation sessions,
  - **Renderer** keeps SVG scene/layer ownership and only renders static + animation passes/helpers.
- Desired minimal animation effect vocabulary:
  - `move`
  - `fade-in`
  - `fade-out`
  - `snap-out`
- `snap-out` is preferred over delaying board commit; delayed commit is explicitly not desired.
- Castling should become just **2 simultaneous move tracks** (king + rook), not a sequential or renderer-special-cased path.
- Matching direction under discussion:
  - do not introduce persistent semantic piece IDs unless strictly necessary,
  - prefer practical transition-time matching from previous to next placements sufficient for ordinary move + castling.
- Renderer structure preference:
  - main renderer still owns layers/scene graph,
  - internal split into static render pass + animation render pass/helper is desirable,
  - not a fully separate external renderer system.
- Animation scene organization preference:
  - keep one shared `animationRoot`,
  - each active animation session gets its own `<g>` group inside it,
  - cleanup/cancel should operate by session group ownership.
- Extensions are not in scope for implementation now, but 3.10 should keep boundaries reusable so later extension-owned animations can coexist with core sessions and reuse standard core effects.
- Practical next-chat goal:
  - read current runtime/renderer animation files first,
  - decide the smallest clean refactor toward `AnimationPlan + Animator`,
  - ensure ordinary move + castling go through one shared pipeline.

## Attached plan

The full implementation plan is attached to this chat as a file, not pasted inline.
Use it as the roadmap reference, but in this chat focus only on the task below.

## Task for next chat

Focus on **Phase 3.10 animation architecture refactor + castling integration**.

Before proposing a plan:

1. Read the current relevant runtime/renderer animation files first.
2. Read the relevant focused tests.
3. List which files you actually inspected.
4. Only then propose the plan.

Main question to answer first:

- What is the **smallest clean refactor** needed to move from the current 3.9 renderer-owned committed animation orchestration toward:
  - `AnimationPlan`
  - dedicated `Animator`
  - renderer-owned scene/layers but renderer not owning animation lifecycle logic

Requirements:

- ordinary move and castling must go through **one shared committed-animation pipeline**
- castling must animate **king and rook simultaneously**
- keep board-state commit **before** animation
- do not delay semantic board commit until animation end
- preserve renderer ownership of SVG layers / scene graph
- prefer renderer split into:
  - static render pass
  - animation render pass/helper
- animation lifecycle / RAF ownership should move into `Animator`
- avoid move-type special-case branches in renderer
- compute animation input from `prev -> next` renderable placements in runtime/core
- do not introduce persistent semantic piece IDs unless strictly necessary
- prefer a practical matching strategy sufficient for:
  - ordinary move
  - castling
- standard core animation effect vocabulary should be minimal and reusable:
  - `move`
  - `fade-in`
  - `fade-out`
  - `snap-out`
- support per-session animation `<g>` groups inside shared `animationRoot`
- do **not** implement extension animation hooks/API yet
- but keep boundaries reusable so extensions can later reuse standard animation effects / session model

Output expectations:

- concise, implementation-oriented plan
- no full code blocks in PLAN
- reference files/functions only
- explicitly separate:
  1. architecture decision
  2. minimal refactor steps
  3. file-level changes
  4. focused test updates
  5. non-goals / deferred items

## Working mode

Work architecture-first.
Keep the step narrow.
Avoid overengineering.
Assume previously confirmed decisions remain in force unless explicitly revised.

Prefer:

1. brief analysis
2. concrete recommendation
3. precise implementation prompt for Cline
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
