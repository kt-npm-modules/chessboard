# Chessboard current plan

## Status

The planned `@mirasen/chessboard` v1 architecture test rebuild is complete.

The previous active plan was to delete obsolete tests and rebuild the test suite subsystem by subsystem:

1. state
2. layout
3. animation
4. runtime
5. render
6. extensions
7. wrapper

That work is complete.

## Current planning state

There is no active v1 test-rebuild plan at this time.

The package has a current architecture-aligned test suite with broad coverage across the core subsystems, render pipeline, runtime, first-party extensions, main renderer, and wrapper.

Remaining uncovered lines are accepted coverage tails unless they correspond to a real bug, regression, or future feature task.

## Next work

Future work should start from a new focused task frame rather than continuing the old test-rebuild plan.

Possible future task categories:

- release polish
- package/API sanity checks
- documentation polish
- example/app smoke checks
- adapter work
- post-v1 feature planning

Do not treat the old subsystem rebuild order as active work.
