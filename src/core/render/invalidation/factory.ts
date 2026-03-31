import { cloneDeep } from 'lodash-es';
import type {
	InvalidationState,
	InvalidationStateBase,
	InvalidationStateBaseInternal,
	InvalidationStateExtensionSnapshot,
	InvalidationStateInternal,
	InvalidationStateSnapshot,
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
			return cloneDeep(internalState);
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

const createInvalidationStateExtension = createInvalidationStateBase;

function createInvalidationStateInternal(): InvalidationStateInternal {
	const baseInternal = createInvalidationStateBaseInternal();
	return {
		...baseInternal,
		extensions: {}
	};
}

export function createInvalidationState(): InvalidationState {
	const internalState = createInvalidationStateInternal();
	const internalBase = createInvalidationStateBase(internalState);
	return {
		...internalBase,
		getExtensions() {
			return { ...internalState.extensions };
		},
		getExtension(extensionId: string) {
			return internalState.extensions[extensionId];
		},
		createExtension(extensionId: string): InvalidationStateBase {
			if (internalState.extensions[extensionId]) {
				throw new Error(`Extension with id "${extensionId}" already exists in invalidation state.`);
			}
			const extension = createInvalidationStateExtension();
			internalState.extensions[extensionId] = extension;
			return extension;
		},
		getSnapshot() {
			let prep = Object.fromEntries(
				Object.entries(internalState).filter(([key]) => key !== 'extensions')
			) as Omit<InvalidationStateInternal, 'extensions'>;
			prep = cloneDeep(prep);
			const extensionsSnapshot = Object.fromEntries(
				Object.entries(internalState.extensions).map(([id, ext]) => [id, ext.getSnapshot()])
			) as Record<string, InvalidationStateExtensionSnapshot>;
			const result: InvalidationStateSnapshot = {
				...prep,
				extensions: extensionsSnapshot
			};
			return result;
		}
	};
}
