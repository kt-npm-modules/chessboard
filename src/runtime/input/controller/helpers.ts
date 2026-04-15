import type { Square } from '../../../state/board/types/internal';
import type { InteractionStateSnapshot } from '../../../state/interaction/types/internal';

export function canMoveTo(snapshot: InteractionStateSnapshot, target: Square): boolean {
	const { movability } = snapshot;

	if (movability.mode === 'disabled') {
		return false;
	}

	if (movability.mode === 'free') {
		// Any square except the currently selected/source square is a valid drop target
		return target !== snapshot.selected?.square;
	}

	// strict: target must be in the computed active destinations
	return snapshot.activeDestinations.has(target);
}
