import { BoardPoint, TransientInput } from '../../../extensions/types/basic/transient-visuals';
import { BoardStateSnapshot, Move, Square } from '../../../state/board/types';
import { InteractionStateSnapshot } from '../../../state/interaction/types';

export interface InteractionRuntimeSurface {
	getInteractionSnapshot(): InteractionStateSnapshot;
	getBoardStateSnapshot(): BoardStateSnapshot;
	startLiftedDrag(source: Square, point: BoardPoint): void;
	dropTo(target: Square): Move;
	startReleaseTargeting(source: Square, point: BoardPoint): void;
	releaseTo(target: Square): Move;
	cancelActiveInteraction(): void;
	cancelInteraction(): void;
	transientInput(input: TransientInput): void;
}

export interface InteractionController {
	onPointerDown(target: Square | null, point: BoardPoint): void;
	onPointerMove(target: Square | null, point: BoardPoint | null): void;
	onPointerUp(target: Square | null): Move | null;
	onPointerCancel(): void;
}
