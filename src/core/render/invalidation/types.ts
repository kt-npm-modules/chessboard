export interface InvalidationStateBaseInternal {
	layers: number;
}

/**
 * Write-only handle passed to reducers that need to mark invalidation.
 * Reducers that receive this can signal which layers need re-rendering.
 * Reducers that do not receive this do not directly mark invalidation.
 */
export interface InvalidationWriter {
	markLayer(layerMask: number): boolean;
}

/**
 * Invalidation internal payload.
 * - layers: DirtyLayer bitmask
 */
export interface InvalidationStateInternal {
	layers: number;
	extensions: Record<string, InvalidationStateBase>;
}

export interface InvalidationStateSnapshotExtension {
	readonly layers: number;
}

export interface InvalidationStateSnapshot {
	readonly layers: number;
	readonly extensions: Record<string, InvalidationStateSnapshotExtension>;
}

export interface InvalidationStateBase extends InvalidationWriter {
	getLayers(): number;
	getSnapshot(): InvalidationStateSnapshotExtension;
	clear(): boolean;
	getWriter(): InvalidationWriter;
}

export interface InvalidationState extends InvalidationStateBase {
	getSnapshot(): InvalidationStateSnapshot;
	getExtensions(): Record<string, InvalidationStateBase>;
	getExtension(extensionId: string): InvalidationStateBase;
	addExtension(extensionId: string): InvalidationStateBase;
}
