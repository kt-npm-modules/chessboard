import { normalizeColor } from '../board/normalize';
import type { Square } from '../board/types';
import { viewSetMovability, viewSetOrientation } from './reducers';
import type {
	Movability,
	ViewState,
	ViewStateInitOptions,
	ViewStateInternal,
	ViewStateSnapshot
} from './types';

function createViewStateInternal(opts: ViewStateInitOptions = {}): ViewStateInternal {
	const orientation = opts.orientation ? normalizeColor(opts.orientation) : 'white';
	const movability = opts.movability ?? { mode: 'disabled' };
	return {
		orientation,
		movability
	};
}

export function getMovabilitySnapshot(movability: Movability): Readonly<Movability> {
	if (movability.mode === 'strict') {
		if (typeof movability.destinations === 'function') {
			return {
				mode: 'strict',
				destinations: movability.destinations
			};
		} else {
			// Deep freeze the record of arrays to prevent accidental mutation by consumers.
			const frozenRecord: Record<string, readonly Square[]> = {};
			for (const [key, dests] of Object.entries(movability.destinations)) {
				frozenRecord[key] = [...dests];
			}
			return {
				mode: 'strict',
				destinations: frozenRecord
			};
		}
	} else {
		return { ...movability }; // 'free' or 'disabled' are already immutable
	}
}

/**
 * Build a public read-only snapshot of the current state.
 */
export function getViewStateSnapshot(state: ViewStateInternal): ViewStateSnapshot {
	const snap: ViewStateSnapshot = {
		orientation: state.orientation,
		movability: getMovabilitySnapshot(state.movability)
	};
	return snap;
}

export function createViewState(opts: ViewStateInitOptions = {}): ViewState {
	const internalState = createViewStateInternal(opts);
	return {
		getOrientation() {
			return internalState.orientation;
		},
		setOrientation(orientation, mutationSession) {
			const newOrient = normalizeColor(orientation);
			return mutationSession.addMutation(
				'view.state.setOrientation',
				viewSetOrientation(internalState, newOrient)
			);
		},
		getMovability() {
			return getMovabilitySnapshot(internalState.movability);
		},
		setMovability(movability, mutationSession) {
			return mutationSession.addMutation(
				'view.state.setMovability',
				viewSetMovability(internalState, movability)
			);
		},
		getSnapshot() {
			return getViewStateSnapshot(internalState);
		}
	};
}
