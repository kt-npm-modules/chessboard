import { cloneDeep } from 'es-toolkit/object';
import { layoutRefreshGeometry } from './reducers';
import { Layout, LayoutInternal } from './types';

function createLayoutInternal(): LayoutInternal {
	return {
		boardSize: 0,
		orientation: 'white',
		geometry: null,
		layoutVersion: 0
	};
}

export function createLayout(): Layout {
	const internalState = createLayoutInternal();

	return {
		get boardSize() {
			return internalState.boardSize;
		},
		get orientation() {
			return internalState.orientation;
		},
		get geometry() {
			return internalState.geometry;
		},
		get layoutVersion() {
			return internalState.layoutVersion;
		},
		refreshGeometry(options, mutationSession) {
			return mutationSession.addMutation(
				'layout.refreshGeometry',
				layoutRefreshGeometry(internalState, options)
			);
		},
		getSnapshot() {
			return cloneDeep(internalState);
		}
	};
}
