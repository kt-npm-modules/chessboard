# Chessboard current plan

## Current status

The project has already crossed the `1.0.0-rc.0` checkpoint.

Already in place:

- framework-agnostic package and public package path
- extension-driven architecture
- built-in first-party extension baseline
- renderer as a first-party extension
- events
- selected square
- active target
- legal moves
- last move
- promotion
- auto-promote
- deferred UI move flow for promotion
- move animation pipeline refactor
- promotion / auto-promote animation semantics cleanup
- updated README
- updated package positioning/copy
- updated website copy
- updated GitHub repo / org profile copy

Not in place yet:

- a real new test suite for the current architecture
- final hardening toward full `v1.0.0`

## Target

Full release `v1.0.0`

## Next phase

Delete obsolete old tests, create a clean new test tree, and rebuild tests from scratch subsystem by subsystem.

## Test subsystems order

1. `state/board`
2. `state/change`
3. `state/view`
4. `state/interaction`
5. `layout`
6. `animation`
7. `runtime`
8. `render`
9. `extensions`
10. `wrapper`

## Test structure

- `tests/state`
- `tests/layout`
- `tests/animation`
- `tests/runtime`
- `tests/render`
- `tests/extensions`
- `tests/wrapper`
- `tests/test-utils`

## Test-utils structure - example

- `tests/test-utils/state/board`
- `tests/test-utils/state/board/mock`
- `tests/test-utils/state/change`
- `tests/test-utils/state/change/mock`
- `tests/test-utils/state/view`
- `tests/test-utils/state/view/mock`
- `tests/test-utils/state/interaction`
- `tests/test-utils/state/interaction/mock`

## Rules

- reusable mocks, builders, and helpers go into `tests/test-utils`
- spec files stay focused
- old tests are treated as obsolete and should be deleted before the new pass starts

## Immediate next step

1. Delete obsolete tests - COMPLETE
2. Create the new `tests/` skeleton - COMPLETE
3. Create the new `tests/test-utils/` skeleton - COMPLETE
4. Start with the `state/*` subsystems
