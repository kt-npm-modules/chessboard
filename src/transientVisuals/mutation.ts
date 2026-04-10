import { ReadonlyDeep } from 'type-fest';
import type { MutationSession } from '../mutation/types';
import { BoardPoint } from './types';

export type TransientVisualsMutationPayloadByCause = {
	'transientVisuals.setDragPointer': ReadonlyDeep<BoardPoint> | null;
};

export type TransientVisualsMutationSession =
	MutationSession<TransientVisualsMutationPayloadByCause>;
