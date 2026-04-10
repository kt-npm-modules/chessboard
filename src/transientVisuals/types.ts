import { ReadonlyDeep } from 'type-fest';
import { TransientVisualsMutationSession } from './mutation';

export interface BoardPoint {
	x: number;
	y: number;
}

export type BoardPointSnapshot = ReadonlyDeep<BoardPoint>;

export interface TransientVisualsInternal {
	dragPointer: BoardPointSnapshot | null;
}

export type TransientVisualsSnapshot = ReadonlyDeep<TransientVisualsInternal>;

export interface TransientVisuals {
	readonly dragPointer: BoardPointSnapshot | null;
	setDragPointer(
		point: BoardPointSnapshot | null,
		mutationSession: TransientVisualsMutationSession
	): boolean;
	getSnapshot(): TransientVisualsSnapshot;
}
