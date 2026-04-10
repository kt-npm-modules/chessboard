import { cloneDeep } from 'es-toolkit/object';
import { BoardPointSnapshot, TransientVisualsInternal } from './types';

export function transientVisualsSetDragPointer(
	state: TransientVisualsInternal,
	point: BoardPointSnapshot | null
): boolean {
	const changed = [state.dragPointer?.x !== point?.x, state.dragPointer?.y !== point?.y].some(
		Boolean
	);

	if (changed) {
		state.dragPointer = cloneDeep(point);
	}

	return changed;
}
