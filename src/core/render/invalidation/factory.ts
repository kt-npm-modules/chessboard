import type {
	InvalidationState,
	InvalidationStateBase,
	InvalidationStateBaseInternal,
	InvalidationStateInternal,
	InvalidationStateSnapshot,
	InvalidationStateSnapshotExtension,
	InvalidationWriter
} from './types';

function createInvalidationWriter(
	internalState: InvalidationStateBaseInternal
): InvalidationWriter {
	return {
		markLayer(layerMask: number): boolean {
			const prevLayers = internalState.layers;
			internalState.layers |= layerMask;
			return internalState.layers !== prevLayers;
		}
	};
}

function createInvalidationStateBaseInternal(): InvalidationStateBaseInternal {
	return {
		layers: 0
	};
}

export function getInvalidationStateBaseSnapshot(
	state: InvalidationStateBaseInternal
): InvalidationStateSnapshotExtension {
	return {
		layers: state.layers
	};
}

function createInvalidationStateBase(
	internalState?: InvalidationStateBaseInternal
): InvalidationStateBase {
	internalState = internalState ?? createInvalidationStateBaseInternal();
	const writer = createInvalidationWriter(internalState);
	return {
		getLayers() {
			return internalState.layers;
		},
		getSnapshot() {
			return getInvalidationStateBaseSnapshot(internalState);
		},
		markLayer(layerMask: number): boolean {
			return writer.markLayer(layerMask);
		},
		clear() {
			const changed = internalState.layers !== 0;
			internalState.layers = 0;
			return changed;
		},
		getWriter() {
			return writer;
		}
	};
}

function createInvalidationStateInternal(): InvalidationStateInternal {
	const baseInternal = createInvalidationStateBaseInternal();
	return {
		...baseInternal,
		extensions: {}
	};
}

export function getInvalidationStateSnapshot(
	state: InvalidationStateInternal
): InvalidationStateSnapshot {
	return {
		layers: state.layers,
		extensions: Object.fromEntries(
			Object.entries(state.extensions).map(([key, ext]) => [key, ext.getSnapshot()])
		)
	};
}

export function createInvalidationState(): InvalidationState {
	const internalState = createInvalidationStateInternal();
	const internalBase = createInvalidationStateBase(internalState);
	return {
		...internalBase,
		getSnapshot() {
			return {
				layers: internalState.layers,
				extensions: Object.fromEntries(
					Object.entries(internalState.extensions).map(([key, ext]) => [key, ext.getSnapshot()])
				)
			};
		},
		getExtensions() {
			return Object.fromEntries(
				Object.entries(internalState.extensions).map(([key, ext]) => [key, ext])
			);
		},
		getExtension(extensionId: string): InvalidationStateBase {
			if (!internalState.extensions[extensionId]) {
				throw new Error(`Extension with id "${extensionId}" does not exist in invalidation state.`);
			}
			return internalState.extensions[extensionId];
		},
		addExtension(extensionId: string): InvalidationStateBase {
			if (internalState.extensions[extensionId]) {
				throw new Error(`Extension with id "${extensionId}" already exists in invalidation state.`);
			}
			const extension = createInvalidationStateBase();
			internalState.extensions[extensionId] = extension;
			return extension;
		}
	};
}
