import type { ReadonlyDeep } from 'type-fest';
import type { Move, MoveRequest, MoveSnapshot } from '../board/types/internal';
import type { ChangeStateMutationSession } from './mutation';

export interface ChangeStateInternalDeferredMove {
	request: MoveRequest;
	move: Move;
}
export interface ChangeStateInternal {
	lastMove: MoveSnapshot | null;
	deferredMove: ChangeStateInternalDeferredMove | null;
}

export type ChangeStateSnapshot = ReadonlyDeep<ChangeStateInternal>;

export interface ChangeState {
	readonly lastMove: ReadonlyDeep<Move> | null;
	setLastMove(
		move: ReadonlyDeep<Move> | null,
		mutationSession: ChangeStateMutationSession
	): boolean;
	getSnapshot(): ChangeStateSnapshot;
}
