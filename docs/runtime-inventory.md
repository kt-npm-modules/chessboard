# Runtime Inventory (feat/v1)

### src/index.ts

- Responsibility: Public package entry that re-exports core state types, renderer contracts/helpers, and the SvgRenderer.

- Key exports: DirtyLayer; types Color, Role, Square, SquareString, StateSnapshot; types Invalidation, Renderer, RenderGeometry; isLightSquare, makeRenderGeometry; cburnettSpriteUrl; SvgRenderer.
- Used by: not clearly referenced in current codebase.

### src/core/state/types.ts

- Responsibility: Core public state types and DirtyLayer enum used across the runtime.
- Key exports: StateSnapshot, DirtyLayer, Square, SquareString, Color, Role, PositionInput.
- Used by: src/core/state/boardState.ts, src/core/state/reducers.ts, src/core/renderer/types.ts, src/core/renderer/SvgRenderer.ts, src/core/input/types.ts, src/core/notation/fen.ts, src/core/policy/types.ts, src/core/scheduler/scheduler.ts, src/core/events/bus.ts.

### src/core/state/boardState.ts

- Responsibility: Internal state shape and constructors; creates initial state and read-only snapshots.
- Key exports: createInitialState, getSnapshot, InternalState.
- Used by: src/core/scheduler/invalidation.ts (InternalState), src/core/state/reducers.ts.

### src/core/state/coords.ts

- Responsibility: Square indexing and conversions between numeric and algebraic coordinates.
- Key exports: fromAlgebraic, toAlgebraic, toValidSquare, fileOf, rankOf, squareOf, assertValidSquare.
- Used by: src/core/state/boardState.ts, src/core/state/reducers.ts, src/core/renderer/geometry.ts, src/core/renderer/SvgRenderer.ts.

### src/core/state/encode.ts

- Responsibility: Compact piece-code encoding/decoding utilities.
- Key exports: encodePiece, decodePiece, isEmpty.
- Used by: src/core/state/boardState.ts, src/core/state/reducers.ts, src/core/renderer/SvgRenderer.ts.

### src/core/state/normalize.ts

- Responsibility: Normalize color and role inputs to canonical long names.
- Key exports: normalizeColor, normalizeRole.
- Used by: src/core/state/boardState.ts, src/core/state/reducers.ts.

### src/core/state/reducers.ts

- Responsibility: State mutation reducers (position, turn, orientation, selection, move) and dirty tracking helpers.
- Key exports: setPosition, setTurn, setOrientation, select, move; markDirtySquare, markDirtyLayer, clearDirty.
- Used by: not clearly referenced in current codebase (expected to be called by a facade/controller).

### src/core/renderer/types.ts

- Responsibility: Renderer contracts and invalidation/geometry interfaces with default config.
- Key exports: Renderer, RenderGeometry, Invalidation, RenderConfig, DEFAULT_RENDER_CONFIG.
- Used by: src/core/renderer/SvgRenderer.ts, src/core/scheduler/scheduler.ts, src/core/scheduler/invalidation.ts.

### src/core/renderer/geometry.ts

- Responsibility: Compute board geometry for an orientation and square parity helper.
- Key exports: makeRenderGeometry, isLightSquare.
- Used by: src/index.ts (re-export), src/core/renderer/SvgRenderer.ts.

### src/core/renderer/assets.ts

- Responsibility: Resolve packaged sprite URL for chess pieces.
- Key exports: cburnettSpriteUrl.
- Used by: src/core/renderer/SvgRenderer.ts, src/index.ts (re-export).

### src/core/renderer/SvgRenderer.ts

- Responsibility: SVG renderer implementing Renderer to draw board, coordinates, and pieces based on invalidation.
- Key exports: SvgRenderer (class).
- Used by: src/index.ts (re-export).

### src/core/scheduler/invalidation.ts

- Responsibility: Derive an Invalidation payload from InternalState dirty flags (pure function).
- Key exports: computeInvalidation.
- Used by: not clearly referenced in current codebase (expected to be used by scheduler/facade).

### src/core/scheduler/scheduler.ts

- Responsibility: rAF-based coalescing scheduler that invokes a render callback with snapshot, invalidation, and optional overlay.
- Key exports: createScheduler, SchedulerOptions, Scheduler, RenderCallback.
- Used by: not clearly referenced in current codebase (used in tests; expected to be used by facade).

### src/core/events/bus.ts

- Responsibility: Minimal typed event bus and default event map for state snapshots.
- Key exports: createBus, Bus, Unsubscribe, ChessboardEventMap.
- Used by: not clearly referenced in current codebase.

### src/core/input/types.ts

- Responsibility: Canonical input event contracts, overlay view, and geometry interface for board-aware input.
- Key exports: InputEvent, OverlayView, InputGeometry, InputOutcome.
- Used by: src/core/scheduler/scheduler.ts (OverlayView type).

### src/core/notation/fen.ts

- Responsibility: FEN parsing/encoding utilities for placement and active color.
- Key exports: START_FEN, parseFenPlacement, parseFenTurn, parseFenAll, toFenPlacement, toFen.
- Used by: src/core/state/boardState.ts, src/core/state/reducers.ts.

### src/core/policy/types.ts

- Responsibility: Policy contracts for legal destination computation and move gating.
- Key exports: DestinationsMap, MovePolicy.
- Used by: not clearly referenced in current codebase.

---

## Confirmed current runtime links

- src/core/state/reducers.ts -> src/core/state/boardState.ts (InternalState typed mutations; imports InternalState).
- src/core/scheduler/invalidation.ts -> src/core/state/boardState.ts (computes invalidation from InternalState).
- src/core/scheduler/scheduler.ts -> src/core/renderer/types.ts (RenderCallback uses Invalidation).
- src/core/scheduler/scheduler.ts -> src/core/input/types.ts (RenderCallback optional overlay uses OverlayView).
- src/core/scheduler/scheduler.ts -> src/core/state/types.ts (RenderCallback uses StateSnapshot).
- src/core/renderer/SvgRenderer.ts -> src/core/renderer/types.ts (implements Renderer, consumes RenderGeometry, Invalidation).
- src/core/renderer/SvgRenderer.ts -> src/core/renderer/geometry.ts (uses isLightSquare).
- src/core/renderer/SvgRenderer.ts -> src/core/renderer/assets.ts (uses cburnettSpriteUrl).
- src/core/renderer/geometry.ts -> src/core/state/coords.ts (uses fileOf, rankOf).
- src/core/state/boardState.ts -> src/core/notation/fen.ts (START_FEN, parseFenPlacement, parseFenTurn).
- src/core/state/boardState.ts -> src/core/state/coords.ts, src/core/state/encode.ts, src/core/state/normalize.ts (helpers).
- src/core/state/reducers.ts -> src/core/notation/fen.ts, src/core/state/coords.ts, src/core/state/encode.ts, src/core/state/normalize.ts (helpers).
- src/core/events/bus.ts -> src/core/state/types.ts (ChessboardEventMap payload StateSnapshot).

## Missing composition link

- There is no internal wiring that connects state mutations + invalidation derivation + scheduler + renderer; specifically, no module composes:
  - createInitialState + reducer calls,
  - computeInvalidation(state),
  - createScheduler({ render: renderer.render, getSnapshot, getInvalidation, clearDirty }),
  - and a RenderGeometry provider passed to renderer.render.

## Phase 2 relevance

- Already participating in runtime flow:
  - State: src/core/state/boardState.ts, src/core/state/reducers.ts, src/core/state/types.ts.
  - Renderer: src/core/renderer/SvgRenderer.ts, src/core/renderer/types.ts, src/core/renderer/geometry.ts, src/core/renderer/assets.ts.
  - Scheduler: src/core/scheduler/scheduler.ts, src/core/scheduler/invalidation.ts.
- Building blocks not yet wired together:
  - Input: src/core/input/types.ts (contracts only; no controller).
  - Events: src/core/events/bus.ts (standalone; not integrated).
  - Policy: src/core/policy/types.ts (contracts; not used).
- Smallest plausible first internal runtime/composition step:
  - Create a thin facade that instantiates InternalState (createInitialState), a SvgRenderer, and a Scheduler using getSnapshot (boardState.getSnapshot), getInvalidation (computeInvalidation), clearDirty (reducers.clearDirty), and a fixed RenderGeometry (makeRenderGeometry), then calls renderer.render(snapshot, geometry, invalidation) inside the scheduler render callback.
