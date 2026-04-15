import { ReadonlyDeep } from 'type-fest';
import { BoardStateMutationSession } from '../mutation';
import { ColorInput, MoveRequestInput, PositionInput } from './input';
import { ColorCode, Move, PieceCode, Square } from './internal';

export interface BoardStateInternal {
	// Encoded pieces on the board
	pieces: Uint8Array;
	// current turn
	turn: ColorCode;
	// Incremented on position changes
	positionEpoch: number;
}

export type BoardStateSnapshot = ReadonlyDeep<BoardStateInternal>;

export interface BoardStateInitOptions {
	position?: PositionInput; // 'start' | FEN | PositionMap | PositionMapShort
	turn?: ColorInput; // optional override of active color
}

export interface BoardState {
	setPosition(input: PositionInput, mutationSession: BoardStateMutationSession): boolean;
	setTurn(turn: ColorInput, mutationSession: BoardStateMutationSession): boolean;
	move(request: MoveRequestInput, mutationSession: BoardStateMutationSession): Move;
	getPieceCodeAt(square: Square): PieceCode;
	getSnapshot(): BoardStateSnapshot;
}
