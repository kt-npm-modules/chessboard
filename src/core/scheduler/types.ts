import { Square } from '../state/boardTypes';

/**
 * Dirty layer flags for precise invalidation.
 * Use bitmask to allow combining layers; renderer/scheduler will interpret these.
 */
export enum DirtyLayer {
	Board = 1, // 1 << 0,
	Pieces = 2, // 1 << 1,
	Drag = 4, // 1 << 2,
	All = Board | Pieces | Drag
}

/**
 * Invalidation internal payload.
 * - layers: DirtyLayer bitmask
 * - squares: live mutable set of dirty squares
 */
export interface InvalidationStateInternal {
	layers: number;
	squares: Set<Square>;
}

/**
 * Invalidation payload shape emitted by the scheduler to the renderer.
 */
export interface InvalidationStateSnapshot {
	readonly layers: number;
	readonly squares?: ReadonlySet<Square>;
}

/**
 * Write-only handle passed to reducers that need to mark invalidation.
 * Reducers that receive this can signal which layers or squares need re-rendering.
 * Reducers that do not receive this do not directly mark invalidation.
 */
export interface InvalidationWriter {
	markLayer(layerMask: number): void;
	markSquares(layerMask: number, squares: Square | Iterable<Square>): void;
}
