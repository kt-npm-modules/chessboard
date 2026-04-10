import { cloneDeep } from 'es-toolkit/object';
import { transientVisualsSetDragPointer } from './reducers';
import { TransientVisuals, TransientVisualsInternal } from './types';

function createTransientVisualsInternal(): TransientVisualsInternal {
	return {
		dragPointer: null
	};
}

export function createTransientVisuals(): TransientVisuals {
	const internalState = createTransientVisualsInternal();

	return {
		get dragPointer() {
			return cloneDeep(internalState.dragPointer);
		},

		setDragPointer(point, mutationSession) {
			const newPointer = cloneDeep(point);
			return mutationSession.addMutation(
				'transientVisuals.setDragPointer',
				transientVisualsSetDragPointer(internalState, newPointer),
				newPointer
			);
		},

		getSnapshot() {
			return cloneDeep(internalState);
		}
	};
}
